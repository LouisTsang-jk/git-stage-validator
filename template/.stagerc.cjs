module.exports = {
  tipsText: {
    includesConfirmContent: "提交的代码中含需要二次确认才能提交的内容：",
    includesForbiddenContent: "提交的代码中含有禁止提交的内容：",
    confirmText: "提交的代码中含需要二次确认才能提交的内容，确认现在需要提交？(Y/n)\n"
  },
  validators: [
    {
      name: "JSON.stringify",
      type: "confirm",
      regex: /JSON\.stringify\(.+\)/,
      msg: `检测到提交的html文件中有"JSON.stringify"`,
      files: ["*.html"]
    },
    {
      name: "| json",
      type: "confirm",
      regex: /\| json/,
      msg: `检测到提交的ts文件中有"* | json"`,
      files: ["*.html"]
    },
    {
      name: "console.log",
      type: "confirm",
      regex: /console\.log\(.+\)/,
      msg: `检测到提交的ts文件中有"console.log"`,
      files: ["*.ts", "*.js"]
    },
    {
      name: "debugger",
      type: "confirm",
      regex: /debugger/,
      msg: `检测到提交的ts文件中有"debugger"`,
      files: ["*.ts"]
    },
  ],
  tips: {
    confirm: '',
    forbid: '',
  }
}