#!/usr/bin/env node
import url from 'url'
import path from 'path'
import chalk from "chalk";
import process from 'process';
import { spawnSync } from "child_process";
import { ThreadResult, ValidatorResult, ValidatorRule } from "./types.d";
import { cpus } from "os";
import { Worker } from "worker_threads";
import { pool } from "./pool.js";
import { validators as defaultValidators } from './validator.js';
import { createInterface } from 'readline';

const CONFIG_FILE = '.stagerc.js'

enum Tips {
  includesConfirmContent = 'The committed code includes content that requires confirmation before proceeding.',
  includesForbiddenContent = 'The committed code includes prohibited content. Please make the necessary modifications before resubmitting.',
  confirmText = 'Confirmation: Do you want to proceed with the submission now? (Y/n)\n'
}

const { default: customConfig } = await import(`${process.cwd()}/${CONFIG_FILE}`)

const { validators: customValidators, tipsText } = customConfig

const validators: ValidatorRule[] = customValidators || defaultValidators

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

const threadPool = pool({
  concurrency: filePaths.length > MAX_THREAD ? MAX_THREAD : filePaths.length,
  tasks: filePaths,
  fn: (filepath: string, index: number) => {
    const WORKER_PATH = path.join(__dirname, 'worker.js')
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

if (!confirmValidResult.length && !forbidValidResult.length) {
  process.exit(0)
}

if (confirmValidResult.length) {
  console.info(
    chalk.bgYellowBright(tipsText?.includesConfirmContent || Tips.includesConfirmContent)
  );
  console.table(confirmValidResult, ["validator", "path", "msg"]);
}

if (forbidValidResult.length) {
  console.timeEnd();
  console.info(chalk.bgRedBright(tipsText?.includesForbiddenContent || Tips.includesForbiddenContent));
  console.table(forbidValidResult, ["validator", "path", "msg"]);
  process.exit(1);
}

if (!forbidValidResult.length && confirmValidResult.length) {
  console.timeEnd();
  rl.question(tipsText?.confirmText || Tips.confirmText, (ans: string) => {
    const answer = ans.toUpperCase() === 'Y'
    process.exit(+!answer);
  })
}
