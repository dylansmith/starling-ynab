/* eslint-env jest */

const fs = require('fs')
const path = require('path')
const qif = require('../qif')

const fixturesDir = path.resolve(__dirname, '../../__fixtures__')

describe('transforms/qif', () => {
  describe('#buildTargetPath', () => {
    it('should add a suffix to the filename', () => {
      expect(qif.buildTargetPath('foo')).toEqual('foo.ynab.qif')
      expect(qif.buildTargetPath('foo.csv')).toEqual('foo.ynab.qif')
      expect(qif.buildTargetPath('foo/bar.csv')).toEqual('foo/bar.ynab.qif')
    })
  })

  describe('#transformInput', () => {
    const fixturePath = `${fixturesDir}/fixture_input.csv`
    let actual

    beforeEach(async () => {
      actual = await qif.transformInput(fixturePath)
    })

    it('should return metadata', () => {
      expect(actual.file).toEqual(fixturePath)
      expect(actual.csv).toEqual(fs.readFileSync(fixturePath, { encoding: 'utf8' }))
    })

    it('should return parsed records', () => {
      const expected = [
        'POpening Balance\n^',
        'D08/03/2019\nT10\nPFoo\nMBar\n^',
        'D13/03/2019\nT-6.7\nPBax\nMQux\n^'
      ]
      expect(actual.records).toEqual(expected)
    })

    it('should return the qif output', () => {
      const expected = fs.readFileSync(`${fixturesDir}/fixture_output.qif`, { encoding: 'utf8' })
      expect(`${actual.output}`).toEqual(expected)
    })

    it('should return undefined output for empty input', async () => {
      actual = await qif.transformInput(`${fixturesDir}/fixture_input_empty.csv`)
      expect(actual.output).toEqual(undefined)
    })
  })
})
