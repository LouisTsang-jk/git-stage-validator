// import inquirer from 'inquirer'
// import { spawn } from 'child_process'

// const validators = [
//   {
//     name: '',
//     type: 'forbid', // 'confirm'
//     regex: [/JSON\.stringify/],
//     msg: '',
//     files: ['*.html']
//   }
// ]

// const command = ['git', 'diff', '--cache']
// const options = ['--diff-filter=A', '--diff-filter=M']

// /**
//  * 性能优化
//  * --no-color-moved
//  * --ignore-cr-at-eol
//  * --ignore-space-at-eol
//  * --ignore-blank-lines
//  */
// const child = spawn('git', ['diff', '--cached', '--diff-filter=A'])

// console.log('- - - - - START - - - - - - ')
// child.stdout.on('data', (data) => {
//   const str = data.toString()
//   if (!str.match(/diff --git/gm)) return
//   const reg = /^\+([^\+][^\+].+)/gm
//   const result = [...str.matchAll(reg)]
//   if (!result) return
//   const diff = result.map(i => i?.[1] || '')
//   console.log(diff)
  
  
// })
// child.stderr.on('data', (data) => {
//   console.log('error: on', data.toString())
// })
// child.on('close', (code) => {
// })
// // const questions = [
// //   {
// //     type: "confirm",
// //     name: "confirm",
// //     message: "Are you sure you want to commit the changes?",
// //   },
// // ];

// // inquirer.prompt(questions).then((answers) => {
// //   console.log('ANS:', answers)
// //   // if (!answers.confirm) {
// //   //   console.log("Commit cancelled.");
// setTimeout(() => {
//   console.log('- - - - - END - - - - - - ')
//   process.exit(1);
// }, 2000);
// //   // }
// // });
