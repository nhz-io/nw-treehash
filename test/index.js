import test from 'ava'
import index from '../index'
import treehash from '../lib/treehash'

test('index', t => {
    t.is(typeof index, 'function')
    t.is(index, treehash)
})
