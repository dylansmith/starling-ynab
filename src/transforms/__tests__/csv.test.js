/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const csv = require('../csv')

const fixturesDir = path.resolve(__dirname, '../../__fixtures__')

describe('transforms/csv', () => {
  describe('#buildTargetPath', () => {
    it('should add a suffix to the filename', () => {
      expect(csv.buildTargetPath('foo')).toEqual('foo.ynab.csv')
      expect(csv.buildTargetPath('foo.csv')).toEqual('foo.ynab.csv')
      expect(csv.buildTargetPath('foo/bar.csv')).toEqual('foo/bar.ynab.csv')
    })
  })

  describe('#transformInput', () => {
    const fixturePath = `${fixturesDir}/fixture_input.csv`
    let actual

    beforeEach(async () => {
      actual = await csv.transformInput(fixturePath)
    })

    it('should return metadata', () => {
      expect(actual.file).toEqual(fixturePath)
      expect(actual.csv).toEqual(fs.readFileSync(fixturePath, { encoding: 'utf8' }))
    })

    it('should return parsed records', () => {
      const expected = [
        {
          Date: '',
          Payee: 'Opening Balance',
          Category: null,
          Memo: '',
          Outflow: null,
          Inflow: null
        },
        {
          Date: '08/03/2019',
          Payee: 'Foo',
          Category: null,
          Memo: 'Bar',
          Outflow: null,
          Inflow: 10
        },
        {
          Date: '13/03/2019',
          Payee: 'Bax',
          Category: null,
          Memo: 'Qux',
          Outflow: 6.7,
          Inflow: null
        }
      ]
      expect(actual.records).toEqual(expected)
    })

    it('should return the csv output', () => {
      const expected = fs.readFileSync(`${fixturesDir}/fixture_output.csv`, { encoding: 'utf8' })
      expect(actual.output).toEqual(expected)
    })

    it('should return undefined output for empty input', async () => {
      actual = await csv.transformInput(`${fixturesDir}/fixture_input_empty.csv`)
      expect(actual.output).toEqual(undefined)
    })
  })
})
