/* eslint-env jest */

const fs = require('fs-extra')
const path = require('path')
const cli = require('../cli')
const transformer = require('../transforms/qif')

const fixturesDir = path.resolve(__dirname, '../__fixtures__')
const noop = () => {}

describe('cli', () => {
  const inputFile = `${fixturesDir}/fixture_input.csv`

  beforeEach(() => {
    jest.spyOn(transformer, 'buildTargetPath')
    jest.spyOn(transformer, 'transformInput')
    jest.spyOn(console, 'log').mockImplementation(noop)
    // prevent writes
    jest.spyOn(cli, 'writeTargetFile').mockImplementation(() => true)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('#withArgs', () => {
    it('should call transformer methods', async () => {
      await cli.withArgs(transformer, [inputFile])
      expect(transformer.buildTargetPath).toHaveBeenCalledTimes(1)
      expect(transformer.transformInput).toHaveBeenCalledTimes(1)
    })

    it('should write the output file', async () => {
      await cli.withArgs(transformer, [inputFile])
      expect(cli.writeTargetFile).toHaveBeenCalledWith(
        `${fixturesDir}/fixture_input.ynab.qif`,
        fs.readFileSync(`${fixturesDir}/fixture_output.qif`, { encoding: 'utf8' })
      )
    })

    it('should transform all csv files in a directory', async () => {
      await cli.withArgs(transformer, [fixturesDir])
      expect(transformer.buildTargetPath).toHaveBeenCalledTimes(2)
      expect(transformer.buildTargetPath).toHaveBeenNthCalledWith(1, `${fixturesDir}/fixture_input.csv`)
      expect(transformer.buildTargetPath).toHaveBeenNthCalledWith(2, `${fixturesDir}/fixture_output.csv`)
      expect(transformer.transformInput).toHaveBeenCalledTimes(2)
    })

    it('should skip existing target paths', async () => {
      transformer.buildTargetPath.mockImplementationOnce(() => inputFile)
      await cli.withArgs(transformer, [inputFile])
      expect(console.log).toHaveBeenCalledWith(`skipping; output path exists (${inputFile})`)
    })

    it('should skip non-existent input paths', async () => {
      const invalidFile = `${fixturesDir}/nope.csv`
      await cli.withArgs(transformer, [invalidFile])
      expect(console.log).toHaveBeenCalledWith(`skipping; non-existent input path (${invalidFile})`)
    })

    it('should skip invalid input paths', async () => {
      fs.statSync = jest.fn(() => {
        return {
          isFile: jest.fn(() => false),
          isDirectory: jest.fn(() => false)
        }
      })

      await cli.withArgs(transformer, [inputFile])
      expect(console.log).toHaveBeenCalledWith(`skipping; input path is not a file or directory (${inputFile})`)
    })
  })
})
