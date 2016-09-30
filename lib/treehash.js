'use strict'

const through = require('through2')
const duplex = require('duplexer2')

const {HASH_SIZE, BLOCK_SIZE} = require('./constants')

const {digest, mkblock, concat, chopper, separator} = require('./helpers')

/** @func transform
  * @desc Hash incoming blocks and store them in queue for next iteration.
  *       When iteration is over, write all the queue to the stream and repeat
  *       Until there is one block left
  * @param {Buffer} block
  * @param {string} enc
  * @param {Callback} cb
  */
function transform(block, enc, cb) {
    if (!this.block) {
        this.block = mkblock()
        this.queue = []
    }

    if (block.length || !this.block.length) {
        if (this.block.length >= BLOCK_SIZE) {
            this.queue.push(this.block)
            this.block = mkblock()
        }
        this.block = concat(this.block, digest(block))

        return cb()
    }

    if (this.queue.length) {
        this.queue.forEach(block => this.write(block))
        this.queue = []
        this.write(this.block)
        this.block = mkblock()
        this.write(mkblock())
    }

    cb()
}

/** @func flush
  * @desc Hash the last block if it is not already a hash and pipe it out
  * @param {Callback} cb
  */
function flush(cb) {
    if (this.block.length > HASH_SIZE) {
        this.block = digest(this.block)
    }
    this.push(this.block)

    cb()
}

/** @func treehash
  * @desc Create a duplex stream joining chopper, separator and hasher
  */
module.exports = function treehash() {
    const chop = chopper()
    const hash = through(transform, flush)

    chop.pipe(separator()).pipe(hash)
    return duplex(chop, hash)
}
