import { spawnSync } from "child_process";
import { parentPort, workerData } from "worker_threads";

const DIFF_COMMAND = ["diff", "--diff-filter=AM", "--cached"];

const { path, regex, threadId } = workerData

const { stdout: fileRaw } = spawnSync("git", [...DIFF_COMMAND, workerData.path]);
const file = fileRaw.toString();
parentPort?.postMessage({ msg: "Hello", threadId });
