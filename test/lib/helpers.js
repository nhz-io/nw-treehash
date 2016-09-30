import {Stream} from 'stream'
import test from 'ava'
import through from 'through2'
import {
    mkhash,
    digest,
    mkblock,
    concat,
    chopper,
    separator,
    fixBase64,
} from '../../lib/helpers'

test('mkhash', t => {
    t.truthy(mkhash() instanceof Stream)
    t.is(typeof mkhash().update, 'function')
    t.is(typeof mkhash().digest, 'function')
})

test('mkblock', t => {
    t.truthy(mkblock() instanceof Buffer)
    t.is(mkblock().length, 0)
    t.is(mkblock(10).length, 10)
})

test('digest 0', t => t.is(
    digest(mkblock()).toString('base64'),
    '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='
))

test('digest 4095', t => t.is(
    digest(Buffer.from(Array(4095 + 1).join('.'))).toString('base64'),
    'Cx/NFiSfI5TOktQmfZkfYupivhHCYhr3MCe6DnhI8wQ='
))

test('digest 4096', t => t.is(
    digest(Buffer.from(Array(4096 + 1).join('.'))).toString('base64'),
    'JkU0J8E8hd8tlJW6GtwWsNJeS18zgRjPw2i8hP8aKdE='
))

test('concat', t => t.is(
    concat(Buffer.from('abc'), Buffer.from('def')).toString(),
    'abcdef'
))

test('chopper', t => t.truthy(chopper() instanceof Stream))

test('chop oversized input into blocks of 4096 bytes', t =>
    new Promise(resolve => {
        const chop = chopper()
        chop.pipe(through(
            function (block, enc, cb) {
                t.true(block.length <= 4096)
                cb()
            },
            function (cb) {
                resolve()
                cb()
            }
        ))
        chop.write(Buffer.from(Array((4096 * 4096) + 256 + 1).join('.')))
        chop.end()
    })
)

test('concat blocks smaller than 4096 bytes', t =>
    new Promise(resolve => {
        const chop = chopper()
        chop.pipe(through(
            function (block, enc, cb) {
                if (block.length) {
                    t.is(block.length, 4096)
                }
                cb()
            },
            function (cb) {
                resolve()
                cb()
            }
        ))

        for (let i = 0; i < (4096 * 4); i++) {
            chop.write(Buffer.from(Array((4096 / 4) + 1).join('.')))
        }
        chop.end()
    })
)

test('separator', t => t.truthy(separator() instanceof Stream))

test('drop zero blocks', t =>
    new Promise(resolve => {
        const separate = separator()
        separate.pipe(through(
            function (block, enc, cb) {
                if (block.test) {
                    t.true(block.length > 0)
                }
                cb()
            },
            function (cb) {
                resolve()
                cb()
            }
        ))

        const data = ['a', 'b', '', '', 'c']
        data.forEach(d => {
            d = Buffer.from(d)
            d.test = true
            separate.write(d)
        })
        separate.end()
    })
)

test('write zero block on end', t =>
    new Promise(resolve => {
        const separate = separator()
        separate.pipe(through(
            function (block, enc, cb) {
                if (!block.test) {
                    t.is(block.length, 0)
                }
                cb()
            },
            function (cb) {
                resolve()
                cb()
            }
        ))

        const data = ['a', 'b', '', '', 'c']
        data.forEach(d => {
            d = Buffer.from(d)
            d.test = true
            separate.write(d)
        })
        separate.end()
    })
)

test('fixBase64', t => {
    t.is(fixBase64('=/+=/+foo'), '_-_-foo')
})
