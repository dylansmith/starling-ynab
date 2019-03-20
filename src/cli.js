const glob = require('glob')
const fs = require('fs-extra')

function transformFile (transformer) {
  return async fp => {
    const outfile = await transformer.buildTargetPath(fp)
    const exists = await fs.exists(outfile)
    if (exists) {
      console.log(`skipping; output path exists (${outfile})`)
    } else {
      const { output } = await transformer.transformInput(fp)
      module.exports.writeTargetFile(outfile, output)
    }
  }
}

/* istanbul ignore next */
async function writeTargetFile (fp, data) {
  await fs.writeFile(fp, data)
  console.log(`wrote ${fp}`)
}

async function withArgs (transformer, args) {
  const fileTransformer = transformFile(transformer)
  const input = args[0]

  if (!fs.existsSync(input)) {
    console.log(`skipping; non-existent input path (${input})`)
    return
  }

  const fstat = fs.statSync(input)
  if (fstat.isFile()) {
    return fileTransformer(input)
  } else if (fstat.isDirectory()) {
    const files = glob.sync('**/*[!.ynab].csv', { cwd: input, absolute: true })
    return Promise.all(files.map(fileTransformer))
  } else {
    console.log(`skipping; input path is not a file or directory (${input})`)
  }
}

module.exports = {
  withArgs,
  writeTargetFile
}
