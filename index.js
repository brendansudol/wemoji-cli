const { createWriteStream } = require('fs')
const { createCanvas, loadImage } = require('canvas')
const GIFEncoder = require('gifencoder')

const IMG_ORDER = ['medium-light', 'dark', 'medium', 'light', 'medium-dark']

const url = (name, variant) => `./img/jpg/${name}/${variant}.jpg`

const getImages = async name =>
  Promise.all(
    IMG_ORDER.map(async variant => await loadImage(url(name, variant)))
  )

const initGif = (name, size) => {
  const gif = new GIFEncoder(size, size)
  gif.start()
  gif.setRepeat(0)
  gif.setQuality(2)
  return gif
}

const initCanvas = size => {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')
  return { canvas, ctx }
}

const drawFrame = (ctx, img1, img2, progress) => {
  const size = ctx.canvas.width
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, 0, size, size)
  ctx.drawImage(img1, 0, 0, size, size)
  ctx.save()
  ctx.globalAlpha = progress
  ctx.drawImage(img2, 0, 0, size, size)
  ctx.restore()
}

module.exports = async (name, opts = {}) => {
  const { size = 240 } = opts

  const gif = initGif(name, size)
  const { ctx } = initCanvas(size)
  const imgs = await getImages(name)

  for (let i = 0; i < imgs.length; i++) {
    const j = (i + 1) % imgs.length
    for (let k = 0; k < 1; k += 0.1) {
      drawFrame(ctx, imgs[i], imgs[j], k)
      gif.setDelay(k === 0 ? 1000 : 25)
      gif.addFrame(ctx)
    }
  }

  gif.finish()
  return gif
}
