const path = require('path')
const { promisify } = require('util')
const csv = require('csv')
const { readFile } = require('fs-extra')

const parse = promisify(csv.parse)
const stringify = promisify(csv.stringify)

function buildTargetPath (fp) {
  const { dir, name } = path.parse(fp)
  return path.join(dir, `${name}.ynab.qif`)
}

async function transformCsv (file) {
  const csv = await readFile(file, { encoding: 'utf-8' })
  const parsed = await parse(csv, { columns: true })
  const records = parsed.map(transformRecord).filter(i => !!i)
  const columns = records.length ? Object.keys(records[0]) : []
  const output = ['!Type:Bank', ...records].join('\n');
  return {
    file,
    csv,
    columns,
    records,
    output
  }
}

function transformRecord (input) {
  const amt = parseFloat(input['Amount (GBP)']) || 0.00
  const date = input['Date']
  if (!(date && amt)) return undefined
  return [
    `D${date}`,
    `T${amt}`,
    `P${input['Counter Party']}`,
    `M${input['Reference']}`,
    '^',
  ].join('\n')
}

module.exports = {
  buildTargetPath,
  transformCsv,
}
