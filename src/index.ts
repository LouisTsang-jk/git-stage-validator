import { confirm } from "@inquirer/prompts";
import { spawnSync } from "child_process";
import chalk from "chalk";
import { ThreadResult, ValidatorResult } from "./types.js";
import { cpus } from "os";
import { Worker } from "worker_threads";
import { pool } from "./pool.js";

const MAX_THREAD = cpus().length * 2;
const THREAD_THRESHOLD = 2;

console.time();


const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { stdout: filenameRaw } = spawnSync("git", [
  ...DIFF_COMMAND,
  "--name-only",
]);

const filePaths = filenameRaw
  .toString()
  .split("\n")
  .filter((i) => i);

const threadPool = pool({
  concurrency: MAX_THREAD,
  tasks: filePaths,
  fn: (path: string, index: number) => {
    console.log('path:', path)
    const worker = new Worker('./src/worker.ts', {
      workerData: {
        path,
        threadId: index
      }
    })
    return new Promise<ThreadResult>((resolve, reject) => {
      worker.once("message", (data: ThreadResult) => {
        resolve(data)
      });
      // TODO invalid scene
    })
  }
})

threadPool.then((data: ThreadResult[]) => {})
const data = await threadPool
const confirmValidResult: ValidatorResult[] = []
const forbidValidResult: ValidatorResult[] = []
data.forEach(result => {
  result.validMsg.forEach(valid => {
    const { validator } = valid
    const target = validator.type === 'confirm' ? confirmValidResult : forbidValidResult
    target.push({
      validator: valid.validator.name,
      path: valid.path,
      msg: valid.msg as string
    })
  })
})

if (confirmValidResult.length) {
  console.info(
    chalk.bgYellowBright("提交的代码中含需要二次确认才能提交的内容：")
  );
  console.table(confirmValidResult, ["validator", "path", "msg"]);
}

if (forbidValidResult.length) {
  console.timeEnd();
  console.info(chalk.bgRedBright("提交的代码中含有禁止提交的内容："));
  console.table(forbidValidResult, ["validator", "path", "msg"]);
  console.info(chalk.bgRedBright("请修改之后再次提交"));
  process.exit(1);
}

if (!forbidValidResult.length && confirmValidResult.length) {
  console.timeEnd();
  const answer = await confirm({
    message: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？\n",
  });
  process.exit(+!answer);
}
