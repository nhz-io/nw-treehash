'use strict'

const crypto = require('crypto')
const through = require('through2')
const chop = require('choppa')

const {HASH, BLOCK_SIZE} = require('./constants')

/** @func mkhash
  * @desc Create hasher with default hashing algorithm
  * @return {Hash}
  */
function mkhash() {
    return crypto.createHash(HASH)
}

/** @func digest
  * @desc Digest the block with default hashing algorithm
  * @param {Buffer} block
  * @return {Buffer}
  */
function digest(block) {
    return mkhash().update(block).digest()
}

/** @func mkblock
  * @desc Create a block (Buffer. Default is empty)
  * @param {number} size
  * @return {Buffer}
  */
function mkblock(size) {
    return Buffer.alloc(size || 0)
}

/** @func concat
  * @desc Concatenate buffers
  * @param {...Buffer} buffers
  * @return {Buffer}
  */
function concat(...buffers) {
    return Buffer.concat(buffers)
}

/** @func chopper
  * @desc Create a stream that splits incoming data into blocks of given size.
  *       Will normalize undersized data into blocks of the size when possible
  * @param {number} size
  * @return {Stream}
  */
function chopper(size) {
    return chop(size || BLOCK_SIZE)
}

/** @func separator
  * @desc Create a stream that filters out empty blocks and
  *       outputs an empty block on end
  * @return {Stream}
  */
function separator() {
    return through(
        function (block, enc, cb) {
            if (!block.length) {
                return cb()
            }

            cb(null, block)
        },
        function (cb) {
            this.emit('data', mkblock())
            cb()
        }
    )
}

/** @func fixBase64
  * @desc Replace `=` with ``, `+` with `-` and `/` with `_`
  * @param {string} str
  * @return {string}
  */
function fixBase64(str) {
    return str.replace(/[=]/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

module.exports = {
    mkhash, digest,
    mkblock,
    concat,
    chopper,
    separator,
    fixBase64,
}
