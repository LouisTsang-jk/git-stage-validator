#!/usr/bin/env node
import url from 'url'
import path from 'path'
import chalk from "chalk";
import process from 'process';
import { spawnSync } from "child_process";
import { ThreadResult, ValidatorResult, ValidatorRule } from "./types.d";
import { cpus } from "os";
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { Worker } from "worker_threads";
import { pool } from "./pool.js";
import { validators as defaultValidators } from './validator.js';
import { createInterface } from 'readline';

const CONFIG_FILE = '.stagerc.js'

enum Tips {
  includesConfirmContent = "Your commit includes content that is validated in .stagerc.cjs. Please check the content of your commit."
}

const filePath = path.join(process.cwd(), CONFIG_FILE)

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

if (!existsSync(filePath)) {
  const templateRaw = readFileSync(path.join(__dirname, path.join('.', 'template', '.stagerc.cjs')), 'utf8')
  writeFileSync(filePath, templateRaw, 'utf8')
}

const { default: customConfig } = await import(filePath)


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
const validResult: ValidatorResult[] = []
data.forEach(result => {
  result.validMsg.forEach(valid => {
    validResult.push({
      validator: valid.validator.name,
      path: valid.path,
      msg: valid.msg as string
    })
  })
})

if (!validResult.length) {
  process.exit(0)
}

if (validResult.length) {
  console.info(chalk.bgYellowBright("Your commit has been canceled. If you're sure you want to ignore this, please add `--no-verify` to your command."))
  console.info(
    chalk.yellowBright(tipsText?.includesConfirmContent || Tips.includesConfirmContent)
  );
  console.table(validResult, ["validator", "path", "msg"]);
  process.exit(1)
}