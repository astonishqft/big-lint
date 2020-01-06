const prettier = require('prettier')

export function formatCode(text: string, parser: string = 'typescript') { // eslint-disable-lint
  const opt = {
    semi: false,
    tabWidth: 2,
    singleQuote: true,
    parser,
    trailingComma: 'all',
  } as any
  return prettier.format(text, opt)
}
