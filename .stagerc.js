export const tipsText = {
  includesConfirmContent: "提交的代码中含需要二次确认才能提交的内容：",
  includesForbiddenContent: "提交的代码中含有禁止提交的内容：",
  confirmText: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？(Y/n)\n"
}

export default [
  {
    name: "JSON.stringify",
    type: "confirm",
    regex: /JSON\.stringify\(.+\)/,
    msg: `Detected 'JSON.stringify' in the HTML file being committed.`,
    files: ["*.html"]
  },
  {
    name: "| json",
    type: "confirm",
    regex: /\| json/,
    msg: `Detected '* | json' in the TypeScript file being committed.`,
    files: ["*.html"]
  },
  {
    name: "console.log",
    type: "confirm",
    regex: /console\.log\(.+\)/,
    msg: `Detected 'console.log' in the TypeScript file being committed.`,
    files: ["*.ts", "*.js"]
  },
  {
    name: "debugger",
    type: "confirm",
    regex: /debugger/,
    msg: `Detected 'debugger' in the TypeScript file being committed.`,
    files: ["*.ts"]
  },
]