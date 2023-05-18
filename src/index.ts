#!/usr/bin/env node --no-warnings --loader @swc-node/register/esm
import url from 'url'
import path from 'path'
import { confirm } from "@inquirer/prompts";
import { spawnSync } from "child_process";
import chalk from "chalk";
import { ThreadResult, ValidatorResult } from "./types.d";
import { cpus } from "os";
import { Worker } from "worker_threads";
import { pool } from "./pool";
import { validators } from './validator';
import { createInterface } from 'readline';
import process from 'process';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
}); 

const MAX_THREAD = cpus().length;

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

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
// const RULES_PATH = path.join(__dirname, '.stagerc.ts')

// const validators = await import(RULES_PATH)

const threadPool = pool({
  concurrency: filePaths.length > MAX_THREAD ? MAX_THREAD : filePaths.length,
  tasks: filePaths,
  fn: (filepath: string, index: number) => {
    const WORKER_PATH = path.join(__dirname, 'worker.ts')
    const worker = new Worker(WORKER_PATH, {
      workerData: {
        path: filepath,
        threadId: index,
        validators
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

threadPool.then((data: ThreadResult[]) => { })
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

console.log('confirmValidResult', confirmValidResult)
console.log('forbidValidResult', forbidValidResult)
if (!confirmValidResult.length && !forbidValidResult.length) {
  process.exit(0)
}

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
  console.log('??')
  rl.question('提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？(Y/n)\n', (ans: string) => {
    const answer = ans.toUpperCase() === 'Y'
    process.exit(+!answer);
  })
}
