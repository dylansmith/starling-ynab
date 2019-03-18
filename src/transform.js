const csv = require('csv')
const { readFile } = require('fs-extra')
const { promisify } = require('util')

const parse = promisify(csv.parse)
const stringify = promisify(csv.stringify)

async function transformStarlingCsv (file) {
  const csv = await readFile(file, { encoding: 'utf-8' })
  const parsed = await parse(csv, { columns: true })
  const records = parsed.map(transformRecord)
  const columns = records.length ? Object.keys(records[0]) : []
  const output = await stringify(records, { columns, header: true })
  return {
    file,
    csv,
    columns,
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
  transformStarlingCsv
}
