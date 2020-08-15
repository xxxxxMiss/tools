import { createCanvas, createObjectURL, revokeObjectURL } from './util'

export function canvas2DataURL(canvas, mimeType = 'image/png', quality = 0.92) {
  canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas
  if(canvas == null) canvas = createCanvas()
  return canvas.toDataURL(mimeType, quality)
}

/**
 * 提取canvas中的数据内容到blob对象， 返回blob对象的promise
 * @param  {[type]} canvas   [description]
 * @param  {String} mimeType [description]
 * @param  {Number} quality  [description]
 * @return {[type]}          [description]
 */
export function canvas2Blob(canvas, mimeType = 'image/png', quality = 0.92) {
  return new Promise((resolve, reject) => {
    if(typeof canvas === 'string'){
      canvas = document.getElementById(canvas)
    }
    if(canvas == null){
      canvas = createCanvas()
    }

    canvas.toBlob(blob => {
      resolve(blob)
    }, mimeType, quality)
  })
}

/**
 * 将canvas中的内容提取到image中显示, 并返回一个包含blob, image对象的promise
 * @param  {[type]} canvas [description]
 * @param  {[type]} image  [description]
 * @return {[type]}        [description]
 */
export function canvas2Image(canvas, mimeType = 'image/png', quality = 0.92) {
  const image = new Image()

  return canvas2Blob(canvas, mimeType, quality).then(blob => {
    const objURL = createObjectURL(blob)

    image.onload = function () {
      revokeObjectURL(objURL)
    }

    image.src = objURL

    return {blob, image}
  })
}

/**
 * 将一张图片不做任何裁剪的绘制到canvas上，并返回包含这个canvas的promise
 * @param  {[type]} image  [description]
 * @param  {[type]} canvas [description]
 * @return {[type]}        [description]
 */
export function image2Canvas(image, canvas) {
  const isUrl = /^(http:\/\/|https:\/\/|\.\/|\.\.\/|\/)/.test(image)
  let ctx = null
  
  if(isUrl){
    const url = image
    image = new Image()
    image.src = url
  }else{
    image = typeof image === 'string' ? document.getElementById(image) : image
  }

  if(image == null) return

  canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas
  
  if(canvas == null){
    ctx = createCanvas(true)
  }else{
    ctx = canvas.getContext('2d')
  }

  image.onload = function () {
    return createImageBitmap(this, 0, 0, image.naturalWith, image.naturalHeight)
      .then(imageBitmap => {
        ctx.drawImage(imageBitmap, 0, 0)
        return canvas
      })
  }
}
