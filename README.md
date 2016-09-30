<h1 align="center">@nhz.io/nw-treehash</h1>

<p align="center">
  <a href="https://npmjs.org/package/@nhz.io/nw-treehash">
    <img src="https://img.shields.io/npm/v/@nhz.io/nw-treehash.svg?style=flat"
         alt="NPM Version">
  </a>

  <a href="https://www.bithound.io/github/nhz-io/nw-treehash">
    <img src="https://www.bithound.io/github/nhz-io/nw-treehash/badges/score.svg"
         alt="Bithound Status">
  </a>

  <a href="https://github.com/nhz-io/nw-treehash/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/nhz-io/nw-treehash.svg?style=flat"
         alt="License">
  </a>
</p>

<h3 align="center">[NWJS](https://nwjs.io) treehash calculator stream<h2>

## Install
```bash
npm i -D @nhz.io/nw-treehash
```

## Usage
```js
// treehash.js

const {createReadStream} = require('fs')
const through = require('through2')
const treehash = require('@nhz.io/nw-treehash')
const {fixBase64} = require('@nhz.io/nw-treehash/lib/helpers')
createReadStream(process.argv[2] || process.argv[1])
	.pipe(treehash())
	.pipe(through((hash, enc, cb) =>
        cb(null, fixBase64(hash.toString('base64')))
    ))
	.pipe(process.stdout)

```

```bash
node treehash.js
...
7rzmHkbwr5NzPjalKEVuArbxg--rbyt5tXdvMYUHXpQ
```

## Dev

```bash
git clone https://github.com/nhz-io/nw-treehash
cd nw-treehash
npm i
npm start
```

### Docs
```bash
npm run doc
```

### Coverage
```bash
npm run coverage
```

### See also

* [https://github.com/nwjs/nw.js/blob/nw13/tools/sign/sign.py](https://github.com/nwjs/nw.js/blob/nw13/tools/sign/sign.py)
* [https://github.com/nwjs/nw.js/blob/nw13/tools/payload.cc](https://github.com/nwjs/nw.js/blob/nw13/tools/payload.cc)

## License

### [MIT](LICENSE)
