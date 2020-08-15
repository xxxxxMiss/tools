/**
 * 获取blob中的数据，这个blob对象的来源可以是:
 * ①<input />元素，DataTransfer, mozGetFile() on HTMLCanvasElement
 * @param  {[type]} blob  [description]
 * @param  {[string]} type  [type of return data]
 * 'arraybuffer', 'binarystring', 'dataurl', 'text'
 * @return {[type]}       [description]
 */
export function getBlobData(blob, type = 'dataurl') {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()

    fileReader.onload = function (e) {
      resolve(fileReader.result)
    }

    fileReader.onerror = function (e) {
      reject(e)
    }

    switch(type){
      case 'arraybuffer':
        return fileReader.readAsArrayBuffer(blob)
      case 'binarystring':
        return fileReader.readAsBinaryString(blob)
      case 'text':
        return fileReader.readAsText(blob)
      case 'dataurl':
      default:
        return fileReader.readAsDataURL(blob)
    }
  })
}

/**
 * 读取本地的文件的内容转化为base64显示在页面上，并返回base64的结果的promise
 * @param  {[type]} input [description]
 * @return {[type]}       [description]
 */
export function file2DataURL(input) {
  if (typeof input === 'string') {
    input = document.getElementById(input)
  }

  if(!input || input && !input.nodeType || input && input.nodeType && input.nodeType !== 1) return

  input.addEventListener('change', (e) => {
    const files = e.target.files
    
    if(files && files.length > 0){
      return getBlobData(files[0]).then(result => {
        input.src = result
        return result
      })
    }
  })
}