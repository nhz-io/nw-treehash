#!/usr/bin/env node

const {createReadStream} = require('fs')
const through = require('through2')
const treehash = require('./treehash')
const {fixBase64} = require('./helpers')

createReadStream(process.argv[2])
    .pipe(treehash())
    .pipe(through((hash, enc, cb) =>
        cb(null, fixBase64(hash.toString('base64')))
    ))
    .pipe(process.stdout)
