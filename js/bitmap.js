/**
 * The ImageBitmap interface represents a bitmap image 
 * which can be drawn to a <canvas> without undue latency
 */

import { createCanvas, clearCanvas } from './util'
import { canvas2DataURL } from './canvas'
/**
 * 将一张大图(比如雪碧图)的各个部分裁剪下来
 * 得到这各个部分bitmap数据的promise
 * @param  {[type]} image  [description]
 * @param  {[type]} coords [description]
 * ['sx, sy, sw, sh']
 * @return {[type]}        [description]
 */
// 这种场景下，图片一般不会直接显示在文档中
// 而且如果那种热区的图片，返回base64也不是很适合了
export function getAreaImage(url, coords) {
  const image = new Image(), ret = []

  image.onload = function () {
    coords.forEach(value => {
      let coord = value.split(/\s*\,\s*/)
      ret.push(createImageBitmap(this, coord[0], coord[1], coord[2], coord[3]))
    })

    return Promise.all(ret)
  }

  image.src = url
}

/**
 * 得到精灵图的各个部分base64编码的promise
 * @param  {[type]} url    [description]
 * @param  {[type]} coords [description]
 * @return {[type]}        [description]
 */
export function getSpritsTwig(url, coords) {
  const ret = [], 
    canvas = createCanvas(),
    ctx = canvas.getContext('2d')

  return getAreaImage(url, coords).then(sprits => {
    sprits.forEach(sprit => {
      ctx.drawImage(sprit, 0, 0)
      ret.push(canvas2DataURL(canvas))
      clearCanvas(canvas)
    })
    return ret
  })
}