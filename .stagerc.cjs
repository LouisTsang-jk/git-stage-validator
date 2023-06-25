module.exports = {
  tipsText: {
    includesConfirmContent: "Your commit includes content that is validated in .stagerc.cjs. Please check the content of your commit."
},
  validators: [
    {
      name: "JSON.stringify",
      regex: /JSON\.stringify\(.+\)/,
      msg: `Detected "JSON.stringify" in the committed html file`,
      files: ["*.html"]
    },
    {
      name: "| json",
      regex: /\| json/,
      msg: `Detected "* | json" in the committed ts file`,
      files: ["*.html"]
    },
    {
      name: "console.log",
      regex: /console\.log\(.+\)/,
      msg: `Detected "console.log" in the committed ts file`,
      files: ["*.ts", "*.js"]
    },
    {
      name: "debugger",
      regex: /debugger/,
      msg: `Detected "debugger" in the committed ts file`,
      files: ["*.ts"]
    },
  ]
}
