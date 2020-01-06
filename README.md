# big-lint

`big-lint` 是一个代码质量检查和美化工具，封装了 `eslint`，`prettier`，`lint-staged`，`husky` 等，无门槛使用。它提供了两种代码检测方式，既可以配置只对提交的代码进行检查，也可以指定路径，对指定路径下的代码进行检查，方便灵活使用。

## 为什么

当前为了保证代码质量的最佳实践是 `ci` 时做全局 `lint`，提交代码只对变更代码进行 `lint`，但这一套流程涉及的包众多，也需要繁琐的配置，但这一切都可以简化，这就是 `big-lint` 存在的意义。

## 安装

- 全局使用
  如果想在全局使用 `big-lint` 可以全局安装：

  ```bash
  $ npm install -g big-lint
  ```
- 项目中使用：
  
  ```bash
  $ npm install big-lint
  ```

## 使用

- 对提交的代码进行校验
  
  在 `package.json` 文件的 `scripts` 中添加:

  ```json
  + "husky": {
  +    "hooks": {
  +        "pre-commit": "big-lint --eslint --staged"
  +     }
  + }
  ```

- 使用 `dir` 参数自定义指定检测文件。
  
  检测你所指定的目录下所有 `js` 文件（不递归检测，只检测指定的当前目录下的 `js`），所以确保你指定的目录下存在 `js` 文件。
  ```bash
  $ big-lint --eslint '/Users/Documents/workspace/demo/src/pages/AppMgr/*.js'
  ```

  检测指定目录下所有子目录中的 `js` 文件：
  ```bash
  $ big-lint --eslint '/Users/Documents/workspace/demosrc/**/*.js'
  ```

  指定多个要检测的 `js` 文件路径，多个路径之间使用逗号进行分隔：
  ```bash
  $ big-lint --eslint '/Users/Documents/workspace/demo/src/pages/AppMgr/**/*.js,/Users/Documents/workspace/demo/src/pages/Button/**/*.js,/Users/Documents/workspace/demo/src/pages/Login/**/*.js'
  ```

  支持指定相对路径进行检测
  ```bash
  $ big-lint --eslint 'src/pages'
  ```

- 使用 `--format` 参数指定控制台的输出格式
  目前支持的输出格式如下：

  - checkstyle
  - codeframe
  - compact
  - html
  - jslint-xml
  - json
  - junit
  - stylish **(默认)**
  - table
  - tap
  - unix
  - visualstudio

  举个🌰：
  ```bash
  $ big-lint --eslint --format=table 'src/pages'
  ```

- 配置忽略检测文件

  使用编辑器在要检测的项目根目录下创建 `.eslintignore` 文件，在该文件中配置需要忽略检测的文件路径，一行配置一个路径，例如以下就是忽略检测所有的文件：

    ```
    **/*.js
    ```

  当 `ESLint` 运行时，在确定哪些文件要检测之前，它会在当前工作目录中查找一个 `.eslintignore` 文件。如果发现了这个文件，当遍历目录时，将会应用这些偏好设置。一次只有一个 `.eslintignore` 文件会被使用，所以，不是当前工作目录下的 `.eslintignore` 文件将不会被用到。该文件的路径写法遵循了 `glob` 语法：
  - *:匹配一个路径部分中0或多个字符, 注意不匹配以.开始的路径,比如.a
  - **: 匹配0个或多个子文件夹
  - ?:匹配一个字符
  - {a,b}: 匹配a或者b, a和b也是通配符,可以由其他通配符组成
  - !: 排除文件,如!a.js表示排除文件a.js

  格式规范如下：
  - 以 # 开头的行被当作注释，不影响忽略模式。
  - 路径是相对于 .eslintignore 的位置或当前工作目录。
  - 忽略模式同 .gitignore 规范。
  - 以 ! 开头的行是否定模式，它将会重新包含一个之前被忽略的模式。
  - 除了 .eslintignore 文件中的模式，ESLint总是忽略 /node_modules/* 和 /bower_components/* 中的文件。

  例如以下写法，就是首先忽略所有 js ,然后去除忽略 `code/portal/src/main/webapp/modules/` 下的所有js ，最终可以达到指定检测该目录中 js 的效果：
  ```
  **/*js
  !code/portal/src/main/webapp/modules/**/*.js
  ```

- 使用 `--prettier` 代码美化
  - 对提交的代码进行美化
  
    ```bash
    $ big-lint --prettier --staged
    ```

  - 对指定路径下的代码进行美化
  
    ```bash
    $ big-lint --prettier 'src/'
    ```

- 使用 `--format` 对代码自动修复

  执行如下命令可以对代码进行自动修复

  - 对提交的代码进行修复
  
    ```bash
    $ big-lint --eslint --fix --staged
    ```

  - 对指定路径下的代码进行修复
  
    ```bash
    $ big-lint --eslint --fix 'src/pages'
    ```


## 参数说明

```bash
$ Usage: big-lint [options] [dir]

# 对指定路径 lint
big-lint --eslint 'src/'

# 只对提交的代码进行 lint
big-lint --staged --eslint

Flags:
--staged, -S              only lint git staged files                          [boolean] [default: false]
--prettier, -p            format code with prettier                           [boolean] [default: false]
--eslint, -e              enable lint javascript                              [boolean] [default: false]
--fix, -f                 fix all eslint and stylelint auto-fixable problems  [boolean] [default: false]
--format, -F              output format of console                            [string]  [default: stylish]
--cwd, -c                 current working directory                           [default: process.cwd()]
```
