import { spawnSync } from "child_process";
import { parentPort, workerData } from "worker_threads";
import {
  FileRawValidator,
  FilenameExtensionValidator
} from "./validator.js";
import { ThreadData, ThreadResult, ValidMsg, ValidatorRule } from "./types.js";

const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { path, validators, threadId } = workerData as ThreadData;

const { stdout: fileRaw } = spawnSync("git", [
  ...DIFF_COMMAND,
  workerData.path,
]);
const file = fileRaw.toString();
const matchUpdateContent = /^\+([^\+][^\+].+)/gm;
const matches = [...`${file}`.matchAll(matchUpdateContent)];
const diff = matches.map((i) => i?.[1] || "").join("\n");
const validator = new FilenameExtensionValidator(new FileRawValidator(null));
const validMsg: ValidMsg[] = [];

validators.forEach(async (rule) => {
  const invalid = await validator.validate({
    rule,
    pathname: path,
    raw: diff,
  });
  if (invalid) {
    validMsg.push({
      validator: rule,
      path,
      msg: validator.validInfo.get('fileRaw'),
    });
  }
});

process.nextTick(() => {
  const msg: ThreadResult = { 
    threadId,
    validMsg
  }
  parentPort?.postMessage(msg);
})