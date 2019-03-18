const glob = require('glob')
const fs = require('fs-extra')

function transformFile (transformer) {
  return async fp => {
    const outfile = await transformer.buildTargetPath(fp)
    const exists = await fs.exists(outfile)
    if (exists) {
      console.log(`skipping existing ${outfile}`)
    } else {
      const { output } = await transformer.transformCsv(fp)
      await fs.writeFile(outfile, output)
      console.log(`wrote ${outfile}`)
    }
  }
}

async function cli(transformer) {
  const fileTransformer = transformFile(transformer)

  if (process.stdin.isTTY) {
    const arg = process.argv[2]
    const fstat = fs.statSync(arg)
    if (fstat.isFile()) {
      fileTransformer(arg)
    } else if (fstat.isDirectory()) {
      const files = glob.sync('**/*[!.ynab].csv', { cwd: arg, absolute: true })
      return Promise.all(files.map(fileTransformer))
    }
  } else {
    console.log('Piping is not supported yet, please pass the file path instead.')
  }
}

module.exports = cli
