import {Stream} from 'stream'
import test from 'ava'
import through from 'through2'
import treehash from '../../lib/treehash'

const testStream = (t, char, size, result) =>
    new Promise(resolve => {
        const stream = treehash()
        stream.pipe(through((hash, enc, cb) => {
            t.is(hash.toString('base64'), result)
            resolve()
            cb()
        }))
        stream.write(Buffer.from(Array(size + 1).join(char)))
        stream.end()
    })

test('treehash', t => {
    t.is(typeof treehash, 'function')
    t.true(treehash() instanceof Stream)
})

test('treehash 0 bytes', t =>
    new Promise(resolve => {
        const stream = treehash()
        stream.pipe(through((hash, enc, cb) => {
            t.is(
                hash.toString('base64'),
                '47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='
            )
            resolve()
            cb()
        }))
        stream.write(Buffer.alloc(0))
        stream.end()
    })
)

test('treehash 4095 bytes', t =>
    testStream(t, '.', 4095, 'Cx/NFiSfI5TOktQmfZkfYupivhHCYhr3MCe6DnhI8wQ=')
)

test('treehash 4096 bytes', t =>
    testStream(t, '.', 4096, 'JkU0J8E8hd8tlJW6GtwWsNJeS18zgRjPw2i8hP8aKdE=')
)

test('treehash 4097 bytes', t =>
    testStream(t, '.', 4097, 'fAU92pVOxXY1+BPEU/OLwaYuowJK7e29Lzxb2K3PRQ4=')
)

test('treehash 16 Megabytes', t =>
    testStream(t, '.', 4096 * 4096, 'myk0NL3tA+eoQrpI0aPa6ExaCjI0DPui6vdMad+0f4Y=')
)
