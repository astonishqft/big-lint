import {formatCode} from './formatCode'
import {
  eslintFilePath,
  prettierrcPath,
  editorconfigPath,
} from './path'
import ignore from 'ignore'
const path = require('path')
const fs = require('fs-extra')

const globby = require('globby')

export const writeFile = (text: string, outputPath: string) => {
  fs.writeFileSync(outputPath, text, {encoding: 'utf8'})
}

export const getEslintConfig = () => {
  const defaultLintrc = `
      module.exports = {

}
    `
  const defaultPrettierrc = `{
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 150,
  "overrides": [
    {
      "files": ".prettierrc",
      "options": { "parser": "json" }
    }
  ]
}
`

  const defaultEditorconfig = `# http://editorconfig.org
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[Makefile]
indent_style = tab
`
  if (!fs.existsSync(eslintFilePath)) {
    const code = formatCode(defaultLintrc)
    writeFile(code, eslintFilePath)
  }
  if (!fs.existsSync(prettierrcPath)) {
    writeFile(defaultPrettierrc, prettierrcPath)
  }
  if (!fs.existsSync(editorconfigPath)) {
    writeFile(defaultEditorconfig, editorconfigPath)
  }
}

// 获取其他需要忽略的规则
function getIgnores(cwd: any) {
  let ignores: any = []
  // 获取 eslintignore 忽略规则
  globby
  .sync('**/.eslintignore', {
    ignore: ['**/node_modules/**'],
    cwd,
  })
  .forEach((file: any) => {
    const result = fs
    .readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .filter((line: any) => line.charAt(0) !== '#')
    ignores = ignores.concat(result)
  })
  return ignores
}

export const getFiles = (patterns: any, cwd: any) => {
  const result = globby
  .sync(patterns, {
    gitignore: true,
    ignore: ['**/node_modules/**', '.git'],
    onlyFiles: true,
    dot: true,
  })
  .map((item: any) => {
    // ignore 包必须使用相对路径
    return path.relative(cwd, item)
  })

  return ignore()
  .add(getIgnores(cwd))
  .filter(result)
}

export const endsWithArray = (str: any, arr: any) => { // eslint-disable-line
  return new RegExp(`${arr.join('$|')}$`).test(str)
}
