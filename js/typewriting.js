export default function typewriting(
  el, 
  sentences = [], 
  perCharDelay = 300, 
  nextLineDelay = 2000) {
  let timerAdd = timerRemove = null
  let i = j = 0

  el = typeof el === 'string'
    ? document.querySelector(el)
    : el

  function add() {
    return setInterval(_ => {
      // here === length
      if (j === sentences[i].length) {
        clearInterval(timerAdd)
        timerAdd = null
      } else {
        el.textContent += sentences[i][j]
        j++
      }

      if (timerAdd == null) {
        setTimeout(_ => {
          timerRemove = remove()
        }, nextLineDelay)
      }
    }, perCharDelay)
  }

  function remove() {
    return setInterval(_ => {
        // so here, first --
      if (j === 0) {
        clearInterval(timerRemove)
        timerRemove = null
      } else {
        j--
        el.textContent = sentences[i].substring(0, j)
      }

      if (timerRemove == null) {
        if (i < sentences.length - 1) {
          i++
        } else {
          i = 0
        }
        timerAdd = add()
      }

    }, perCharDelay)
  }
  
  timerAdd = add()
}