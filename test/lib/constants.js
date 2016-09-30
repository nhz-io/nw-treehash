import test from 'ava'
import {HASH, HASH_SIZE, BLOCK_SIZE} from '../../lib/constants'

test('HASH', t => t.is(HASH, 'sha256'))

test('HASH_SIZE', t => t.is(HASH_SIZE, 32))

test('BLOCK_SIZE', t => t.is(BLOCK_SIZE, 4096))
