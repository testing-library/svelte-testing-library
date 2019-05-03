const rollup = require('rollup')
const esm = require('esm')

const config = esm(module)('../rollup.config')

function generateOptions(filePath, name) {
  return {
    input: {input: filePath, plugins: config.default.plugins},
    output: {
      file: `./dist/test/${name}.js`,
      format: 'cjs',
    },
  }
}

function compile(filePath, name) {
  const {input, output} = generateOptions(filePath, name)

  return rollup.rollup(input).then(bundle => bundle.generate(output))
}

module.exports = {compile}
