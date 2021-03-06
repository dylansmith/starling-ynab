const path = require('path')
const { promisify } = require('util')
const csv = require('csv')
const { readFile } = require('fs-extra')

const parse = promisify(csv.parse)
const stringify = promisify(csv.stringify)

function buildTargetPath (fp) {
  const { dir, name } = path.parse(fp)
  return path.join(dir, `${name}.ynab.csv`)
}

async function transformInput (file) {
  const csv = await readFile(file, { encoding: 'utf-8' })
  const parsed = await parse(csv, { columns: true })
  const records = parsed.map(transformRecord)
  let output
  if (records.length) {
    const columns = Object.keys(records[0])
    output = await stringify(records, { columns, header: true })
  }
  return {
    file,
    csv,
    records,
    output
  }
}

function transformRecord (input) {
  const amt = parseFloat(input['Amount (GBP)'])
  return {
    Date: input['Date'],
    Payee: input['Counter Party'],
    Category: null,
    Memo: input['Reference'],
    Outflow: amt < 0 ? Math.abs(amt) : null,
    Inflow: amt >= 0 ? amt : null
  }
}

module.exports = {
  buildTargetPath,
  transformInput
}
