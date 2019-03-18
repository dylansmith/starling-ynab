#!/usr/bin/env node

const glob = require('glob')
const path = require('path')
const fs = require('fs-extra')
const { transformStarlingCsv } = require('./transform')

async function generateOutPath (fp) {
  const { dir, name, ext } = path.parse(fp)
  return path.join(dir, `${name}.ynab${ext}`)
}

async function transformFile (fp) {
  const outfile = await generateOutPath(fp)
  const exists = await fs.exists(outfile)
  if (exists) {
    console.log(`skipping existing ${outfile}`)
  } else {
    const { output } = await transformStarlingCsv(fp)
    await fs.writeFile(outfile, output)
    console.log(`wrote ${outfile}`)
  }
}

async function transformDirectory (cwd) {
  const files = glob.sync('**/*[!.ynab].csv', { cwd, absolute: true })
  return Promise.all(files.map(transformFile))
}

if (process.stdin.isTTY) {
  const arg = process.argv[2]
  const fstat = fs.statSync(arg)
  if (fstat.isFile()) {
    transformFile(arg)
  } else if (fstat.isDirectory()) {
    transformDirectory(arg)
  }
} else {
  console.log('Piping is not supported yet, please pass the file path instead.')
}
