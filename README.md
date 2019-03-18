# starling-ynab

A small command-line utility to convert [Starling Bank](https://www.starlingbank.com/) CSV statements into [YNAB](https://www.youneedabudget.com/) format.

Disclaimer: I personally use YNAB 4, and have not yet tested this with "New YNAB" as yet.

## Installation

```sh
$ npm install -g starling-ynab
```

## Usage

1. Export statements via the Starling Bank app, choosing "CSV" as the output format.
2. Choose "Export Statement" and save it somewhere accessible (e.b. Google Drive, Dropbox)
3. Run the following to generate YNAB-compatible CSV files:

```sh
$ starling_ynab_convert <file_or_directory_path>
```

Given the file `StarlingStatement_2019-03.csv`, it will generate `StarlingStatement_2019-03.ynab.csv`.

---

[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)
