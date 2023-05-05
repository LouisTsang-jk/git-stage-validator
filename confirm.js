import { confirm } from "@inquirer/prompts";

const answer = await confirm({
  message: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？\n",
});
console.log("answer:", answer);
