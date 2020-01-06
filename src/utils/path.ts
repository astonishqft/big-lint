const fs = require('fs')
const path = require('path')

export const appDir = path.resolve(fs.realpathSync(process.cwd())) // eslint-disable-line

export const tscScript = path.join(appDir, 'node_modules', '.bin', 'tsc')
export const lintStagedPath = path.join(appDir, 'node_modules', '.bin', 'lint-staged')
export const eslintPath = path.join(appDir, 'node_modules', '.bin', 'eslint')
export const prettierPath = path.join(appDir, 'node_modules', '.bin', 'prettier')
export const eslintFilePath = path.join(appDir, '.eslintrc.js')
export const prettierrcPath = path.join(appDir, '.prettierrc')
export const editorconfigPath = path.join(appDir, '.editorconfig')
