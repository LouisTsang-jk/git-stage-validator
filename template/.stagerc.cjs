module.exports = {
  tipsText: {
    includesConfirmContent: "The committed code includes content that requires secondary confirmation before being committed:",
    includesForbiddenContent: "The committed code includes forbidden content:",
    confirmText: "The committed code includes content that requires secondary confirmation. Confirm that you want to proceed with the commit? (Y/n)\n"
  },
  validators: [
    {
      name: "JSON.stringify",
      type: "confirm",
      regex: /JSON\.stringify\(.+\)/,
      msg: `Detected "JSON.stringify" in the committed html file`,
      files: ["*.html"]
    },
    {
      name: "| json",
      type: "confirm",
      regex: /\| json/,
      msg: `Detected "* | json" in the committed ts file`,
      files: ["*.html"]
    },
    {
      name: "console.log",
      type: "confirm",
      regex: /console\.log\(.+\)/,
      msg: `Detected "console.log" in the committed ts file`,
      files: ["*.ts", "*.js"]
    },
    {
      name: "debugger",
      type: "confirm",
      regex: /debugger/,
      msg: `Detected "debugger" in the committed ts file`,
      files: ["*.ts"]
    },
  ]
}
