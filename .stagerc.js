export const tipsText = {
  includesConfirmContent: "提交的代码中含需要二次确认才能提交的内容："
}

export default [
  {
    name: "JSON.stringify",
    regex: /JSON\.stringify\(.+\)/,
    msg: `Detected 'JSON.stringify' in the HTML file being committed.`,
    files: ["*.html"]
  },
  {
    name: "| json",
    regex: /\| json/,
    msg: `Detected '* | json' in the TypeScript file being committed.`,
    files: ["*.html"]
  },
  {
    name: "console.log",
    regex: /console\.log\(.+\)/,
    msg: `Detected 'console.log' in the TypeScript file being committed.`,
    files: ["*.ts", "*.js"]
  },
  {
    name: "debugger",
    regex: /debugger/,
    msg: `Detected 'debugger' in the TypeScript file being committed.`,
    files: ["*.ts"]
  },
]