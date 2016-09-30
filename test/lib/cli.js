import {exec} from 'child_process'
import path from 'path'
import {writeFileSync, unlinkSync} from 'fs'

import test from 'ava'
import tempfile from 'tempfile'

const testCli = (t, char, size, result) =>
    new Promise((resolve, reject) => {
        const tmp = tempfile()
        writeFileSync(tmp, size ? Array(size + 1).join(char) : '')

        const proc =
            exec(`node ${path.resolve(__dirname, '../../lib/cli.js')} ${tmp}`)

        proc.stdout.on('data', data => t.is(data, result))

        proc.stderr.on('data', err => {
            unlinkSync(tmp)
            reject(err)
        })

        proc.on('error', err => {
            unlinkSync(tmp)
            reject(err)
        })

        proc.on('close', err => {
            unlinkSync(tmp)
            if (err) {
                return reject(err)
            }
            resolve()
        })
    })

test('caluculate hash with cli for empty file', t => testCli(t, '.',
    0, '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU'
))

test('caluculate hash with cli for 4095 bytes', t => testCli(t, '.',
    4095, 'Cx_NFiSfI5TOktQmfZkfYupivhHCYhr3MCe6DnhI8wQ'
))

test('caluculate hash with cli for 4096 bytes', t => testCli(t, '.',
    4096, 'JkU0J8E8hd8tlJW6GtwWsNJeS18zgRjPw2i8hP8aKdE'
))

test('caluculate hash with cli for 4097 bytes', t => testCli(t, '.',
    4097, 'fAU92pVOxXY1-BPEU_OLwaYuowJK7e29Lzxb2K3PRQ4'
))

test('caluculate hash with cli for 16 Megabytes', t => testCli(t, '.',
    4096 * 4096, 'myk0NL3tA-eoQrpI0aPa6ExaCjI0DPui6vdMad-0f4Y'
))
