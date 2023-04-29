import inquirer from "inquirer";
import { spawnSync } from "child_process";

interface Validator {
  name: string;
  type: "forbid" | "confirm";
  regex: RegExp;
  msg: string;
  files: `*.${string}`[];
}

const CONFIRM_TIP = "(y-yes、n-no、s-skip)";

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
];

const commandArgs = ["diff", "--cached"];
const commandOptions = ["--diff-filter=A", "--diff-filter=M"];

const [A, M] = commandOptions.map((option) => [...commandArgs, option]);

const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { stdout: filenameRaw } = spawnSync("git", [
  ...DIFF_COMMAND,
  "--name-only",
]);

const filePaths = filenameRaw
  .toString()
  .split("\n")
  .filter((i) => i);

const table: any[] = [];
for (const validator of validators) {
  for (const wildcard of validator.files) {
    for (const path of filePaths) {
      const reg = new RegExp(`.+\.${wildcard.replace(/\.(.+)$/, "$1")}$`);
      const isMatch = reg.test(path);
      isMatch && table.push({
        'validator': validator.name, path, 'msg': validator.msg
      });
      if (isMatch) {
        const { stdout: fileRaw } = spawnSync("git", [...DIFF_COMMAND, path]);
        const file = fileRaw.toString()
        const matchUpdateContent = /^\+([^\+][^\+].+)/gm;
        const matches = [
          ...`${file}`.matchAll(matchUpdateContent),
        ];
        const diffRow = matches.map((i) => i?.[1] || "");
        for (const diff of diffRow) {
          if (validator.regex.test(diff)) {
            // console.log(`匹配到:${validator.name}，请检查文件:${path}`)
            // TODO table push
            // TODO ignore duplicate validator in same file
          }
        }
        break
      }
    }
  }
}

console.table(table);

process.exit();

const { stdout: childA } = spawnSync("git", A);
const { stdout: childM } = spawnSync("git", M);

const matchDiffResultReg = /diff --git/gm;

const matchUpdateContent = /^\+([^\+][^\+].+)/gm;

console.log("start:A", childA.toString());
console.log("start:M", childM.toString());
const matches = [
  ...`${childA.toString()}${childM.toString()}`.matchAll(matchUpdateContent),
];
const diff = matches.map((i) => i?.[1] || "");
// console.log('diff', diff);

// childA.stdout.on("data", (data: Buffer) => {
//   const output = data.toString();
//   console.log("stdout:", output);
//   if (!output.match(matchDiffResultReg)) return;
//   const matches = [...output.matchAll(matchUpdateContent)];
//   if (!matches) return;
// });

// childA.stderr.on("data", (data) => {
//   console.log("err:", data.toString());
// });

console.log("end");
