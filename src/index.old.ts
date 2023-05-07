import { confirm } from "@inquirer/prompts";
import { spawnSync } from "child_process";
import chalk from "chalk";

enum ValidatorType {
  forbid,
  confirm,
}

console.time();

interface Validator {
  name: string;
  type: keyof typeof ValidatorType;
  regex: RegExp;
  msg: string;
  files: (`*.${string}` | `*`)[];
}

interface ValidatorResult {
  validator: string;
  path: string;
  msg: string;
}

const validators: Validator[] = [
  {
    name: "JSON.stringify",
    type: "confirm",
    regex: /JSON\.stringify/,
    msg: `检测到提交的html文件中有"JSON.stringify"`,
    files: ["*.html"],
  },
  {
    name: "| json",
    type: "confirm",
    regex: /\| json/,
    msg: `检测到提交的ts文件中有"* | json"`,
    files: ["*.html"],
  },
  {
    name: "console.log",
    type: "confirm",
    regex: /console\.log/,
    msg: `检测到提交的ts文件中有"console.log"`,
    files: ["*.ts", "*.js"],
  },
  {
    name: "debugger",
    type: "confirm",
    regex: /debugger/,
    msg: `检测到提交的ts文件中有"debugger"`,
    files: ["*.ts"],
  },
];

const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { stdout: filenameRaw } = spawnSync("git", [
  ...DIFF_COMMAND,
  "--name-only",
]);

const filePaths = filenameRaw
  .toString()
  .split("\n")
  .filter((i) => i);

const forbidValidResult: ValidatorResult[] = [];
const confirmValidResult: ValidatorResult[] = [];

let cycleCounter = 0

for (const validator of validators) {
  for (const wildcard of validator.files) {
    for (const path of filePaths) {
      const reg = new RegExp(`.+\.${wildcard.replace(/\.(.+)$/, "$1")}$`);
      const isMatch = reg.test(path);
      if (isMatch) {
        const target =
          validator.type === "forbid" ? forbidValidResult : confirmValidResult;
        const { stdout: fileRaw } = spawnSync("git", [...DIFF_COMMAND, path]);
        const file = fileRaw.toString();
        const matchUpdateContent = /^\+([^\+][^\+].+)/gm;
        const matches = [...`${file}`.matchAll(matchUpdateContent)];
        const diffRow = matches.map((i) => i?.[1] || "");
        for (const diff of diffRow) {
          cycleCounter++
          if (validator.regex.test(diff)) {
            validator.regex.lastIndex = 0;
            target.push({
              validator: validator.name,
              path,
              msg: diff,
            });
          }
        }
      }
    }
  }
}

if (confirmValidResult.length) {
  console.info(
    chalk.bgYellowBright("提交的代码中含需要二次确认才能提交的内容：")
  );
  console.table(confirmValidResult, ["validator", "path", "msg"]);
}

if (forbidValidResult.length) {
  console.info(chalk.bgRedBright("提交的代码中含有禁止提交的内容："));
  console.table(forbidValidResult, ["validator", "path", "msg"]);
  console.info(chalk.bgRedBright("请修改之后再次提交"));
  process.exit(1);
}

if (!forbidValidResult.length && confirmValidResult.length) {
  console.log('filePaths', filePaths)
  console.log('Time:', cycleCounter)
  console.timeEnd();
  const answer = await confirm({
    message: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？\n",
  });
  process.exit(+!answer);
}
