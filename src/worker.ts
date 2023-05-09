import { spawnSync } from "child_process";
import { parentPort, workerData } from "worker_threads";
import {
  FileRawValidator,
  FilenameExtensionValidator,
  validators,
} from "./validator.js";

const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { path, regex, threadId } = workerData;

const { stdout: fileRaw } = spawnSync("git", [
  ...DIFF_COMMAND,
  workerData.path,
]);
const file = fileRaw.toString();
const matchUpdateContent = /^\+([^\+][^\+].+)/gm;
const matches = [...`${file}`.matchAll(matchUpdateContent)];
const diff = matches.map((i) => i?.[1] || "").join("\n");
const validator = new FilenameExtensionValidator(new FileRawValidator(null))
  .validate;
const validMsg: {
  validator: string;
  path: string;
  msg: string;
}[] = [];
validators.forEach(async (rule) => {
  const invalid = await validator({
    rule,
    pathname: path,
    raw: diff,
  });
  if (invalid) {
    validMsg.push({
      validator: rule.name,
      path,
      msg: rule.msg,
    });
  }
});
// FIXME just debug
setTimeout(() => {
  debugger;
  parentPort?.postMessage({ diff, threadId, validMsg });
}, 2000);
