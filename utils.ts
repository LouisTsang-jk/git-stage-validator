function traversePath (path: string []) {
  for (const path of filePaths) {
    const reg = new RegExp(`.+\.${wildcard.replace(/\.(.+)$/, "$1")}$`);
    const isMatch = reg.test(path);
    isMatch && table.push({
      'validator': validator.name, path, 'msg': validator.msg
    });
    if (isMatch) {
      const { stdout: fileRaw } = spawnSync("git", [...DIFF_COMMAND, path]);
      const file = fileRaw.toString()
      const matchUpdateContent = /^\+([^\+][^\+].+)/gm;
      const matches = [
        ...`${file}`.matchAll(matchUpdateContent),
      ];
      const diffRow = matches.map((i) => i?.[1] || "");
      for (const diff of diffRow) {
        if (validator.regex.test(diff)) {
          // console.log(`匹配到:${validator.name}，请检查文件:${path}`)
          // TODO table push
          // TODO ignore duplicate validator in same file
        }
      }
      break
    }
  }
}