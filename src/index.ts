import { confirm } from "@inquirer/prompts";
import { spawnSync } from "child_process";
import chalk from "chalk";
import { ValidatorResult } from "./types.js";
import { validators } from "./validator.js";
import { cpus } from 'os'

console.log('cpus', cpus().length)

console.time()

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
  console.timeEnd()
  process.exit(1);
}

if (!forbidValidResult.length && confirmValidResult.length) {
  const answer = await confirm({
    message: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？\n",
  });
  console.timeEnd()
  process.exit(+!answer);
}
