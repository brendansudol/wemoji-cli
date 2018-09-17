#!/usr/bin/env node
const fs = require('fs')
const build = require('./index')
const { emojis } = require('./data')

const data = emojis
const size = 200

const run = async () => {
  const dir = `./build/${size}`
  if (!fs.existsSync(dir)) fs.mkdirSync(dir)

  for (const emoji of data) {
    console.log(`${emoji}...`)
    const gif = await build(emoji, { size })
    fs.writeFileSync(`${dir}/${emoji}.gif`, gif.out.getData())
  }
}

run()
