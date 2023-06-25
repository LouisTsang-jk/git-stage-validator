import { existsSync, readFileSync, writeFileSync, appendFileSync } from 'fs'
import path from 'path'
import url from 'url'

export const CONFIG_FILE = '.stagerc.cjs'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

const stagercFilePath = `${process.cwd()}/${CONFIG_FILE}`

export function initialize () {
  /** check .stagerc.cjs */
  if (!existsSync(stagercFilePath)) {
    const templateRaw = readFileSync(path.join(__dirname, './template/.stagerc.cjs'), 'utf8')
    writeFileSync(stagercFilePath, templateRaw, 'utf8')
  }
}