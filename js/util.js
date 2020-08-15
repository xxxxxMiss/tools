/**
 * 解码base64编码的字符串
 * @param  {[type]} encodeData [description]
 * @return {[type]}            [description]
 */
export function atob(encodeData){
  return atob(encodeData)
}
/**
 * 将str编码为base64编码
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
export function btoa(str){
  return btoa(str)
}

export function createObjectURL(blob) {
  return URL.createObjectURL(blob)
}

export function revokeObjectURL(objURL) {
  URL.revokeObjectURL(objURL)
}

export function createCanvas(needCtx){
  let canvas = document.createElement('canvas')
  if(needCtx) return canvas.getContext('2d')
  return canvas
}

export function clearCanvas(canvas) {
  canvas.clearRect(0, 0, canvas.width, canvas.height)
}
/**
 * [createHotArea description]
 * @param  {[type]} image    [description]
 * @param  {[type]} coordArr [description]
 * ['x1,y1,x2,y2, url', 'x1,y1,r, url', 'x1,y1,x2,y2,x3,y3,...,url']
 * @return {[type]}          [description]
 */
export function createHotArea(image, coordArr){
  image = typeof image === 'string' ? document.getElementById(image) : image

  if(!image) return

  let fragment = document.createDocumentFragment(),
      map = document.createElement('map'),
      ident = `map_${Date.now()}`

  image.setAttribute('usemap', `#${ident}`)

  map.setAttribute('name', ident)
  map.setAttribute('id', ident)

  coordArr.forEach(value => {
    let area = document.createElement('area'),
        v = value.split(/\s*\,\s*/),
        coord = v.slice(0, -1), 
        len = coord.lenght,
        href = v[len -1] ? v[len - 1] : '#',
        shape = len > 4 ? 'poligon' : len === 3 ? 'circle' : 'rect'

    area.setAttribute('shape', shape)
    area.setAttribute('coords', coord.join(','))
    area.setAttribute('href', href)

    area.style.outLine = 'none'

    fragment.appendChild(area)
  })

  map.appendChild(fragment)
  image.parentElement.appendChild(map)
}