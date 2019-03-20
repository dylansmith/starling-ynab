# starling-ynab

[![CircleCI](https://circleci.com/gh/dylansmith/starling-ynab.svg?style=svg)](https://circleci.com/gh/dylansmith/starling-ynab)

A small command-line utility to convert [Starling Bank](https://www.starlingbank.com/) CSV statements into [YNAB](https://www.youneedabudget.com/)-compatible formats (CSV or QIF).

Disclaimer: I personally use YNAB 4, and have not yet tested this with "New YNAB" as yet.

## Installation

```sh
$ npm install -g starling-ynab
```

## Usage

1. Export statements via the Starling Bank app, choosing "CSV" as the output format.
2. Choose "Export Statement" and save it somewhere accessible (e.g. Google Drive, Dropbox)

### Converting to QIF

```sh
$ starling_ynab_qif <file_or_directory_path>
```

Given the file `StarlingStatement_2019-03.csv`, it will generate `StarlingStatement_2019-03.ynab.qif`.

### Converting to CSV

```sh
$ starling_ynab_csv <file_or_directory_path>
```

Given the file `StarlingStatement_2019-03.csv`, it will generate `StarlingStatement_2019-03.ynab.csv`.

---

## Release History

* 2.0.3
  - setup CI
* 2.0.2
  - tests, refactoring and improvements
  - added keywords
* 2.0.1
  - README fixes
* 2.0.0
  - added QIF conversion
  - renamed bin commands to `starling_ynab_qif` and `starling_ynab_csv`
* 1.0.1
  - fixed issue with CLI script
* 1.0.0
  - initial release featuring CSV to CSV conversion

---

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
