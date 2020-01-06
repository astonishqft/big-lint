import {Command} from '@oclif/command'
import {join} from 'path'
import {writeFileSync} from 'fs'
import {getEslintConfig, getFiles, endsWithArray} from './utils/utils'
import flagConfig from './utils/options'
import {
  lintStagedPath,
  eslintPath,
  prettierPath,
} from './utils/path'

const spawn = require('cross-spawn')

class HappyLint extends Command {
  static description = '检测js(eslint)'

  static flags = flagConfig

  static args = [
    {
      name: 'dir',
      description: '指定路径',
    },
  ]

  async run() {
    const {args, flags} = this.parse(HappyLint)
    const {staged, ...rest} = flags
    const {dir} = args

    if (staged) {
      await this.lintStaged(rest)
    } else {
      await this.lint({...rest, dir})
    }
  }

  async lint(flags: any) {
    const {dir, cwd, prettier, eslint, fix, format} = flags
    if (dir === undefined) {
      this.error('please specify a path to lint')
    }
    // 支持多路径，以逗号分隔
    let filePath: any

    if (dir.split(',').length !== 0) {    // eslint-disable-line
      filePath = dir.split(',')
    } else {
      filePath = dir
    }

    const allFiles = getFiles(filePath, cwd)
    try {
      if (eslint) {
        getEslintConfig()
        const eslintExtensions = ['.js', '.jsx', '.ts', '.tsx']
        const files = allFiles.filter(item => endsWithArray(item, eslintExtensions))
        if (files.length > 0) {
          let args = fix ? ['--fix', ...files] : [...files] // eslint-disable-line
          args = format !== 'stylish' ? ['-f', format, ...args] : [...args] // eslint-disable-line
          spawn.sync(eslintPath, args, {stdio: 'inherit'})
        }
      }

      if (prettier) {
        const prettierExtensions = ['.js', '.jsx', '.ts', '.tsx', '.css', '.less', '.scss', '.sass']
        const files = allFiles.filter(item =>
          endsWithArray(item, prettierExtensions),
        )
        if (files.length > 0) {
          spawn.sync(prettierPath, ['--write', ...files], {stdio: 'inherit'})
        }
      }
    } catch (error) {
      this.error(error)
    }
  }

  async lintStaged(flags: any) {
    const {prettier, eslint, fix, format} = flags
    getEslintConfig()

    let eslintCommon = fix ? `${eslintPath} --fix` : eslintPath

    // 增加格式化输出
    if (format !== 'stylish') {
      eslintCommon = `${eslintCommon} -f ${format}`
    }

    const lintstagedrc = {
      ...(prettier && {
        '*.{js,jsx,ts,tsx,less,scss,sass,css}': [
          `${prettierPath} --write`,
          'git add',
        ],
      }),
      ...(eslint && {
        '*{.js,.jsx,.ts,.tsx}': [
          eslintCommon,
          'git add',
        ],
      }),
    }
    const rcPath = join(__dirname, '.lintstagedrc.json')
    writeFileSync(rcPath, JSON.stringify(lintstagedrc))

    try {
      const child = spawn(lintStagedPath, ['-c', rcPath], {stdio: 'inherit'})
      child.on('close', (code: any) => {
        process.exit(code) // eslint-disable-line
      })
    } catch (error) {

    }
  }
}

export = HappyLint
