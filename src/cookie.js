import Cookies from 'js-cookie'
import { parseTimeStr } from './helpers'

function parseCookie() {
  const json = Cookies.getJSON()
  const pairs = []
  for (const key in json) {
    pairs.push([key, json[key]])
  }
  return new Map(pairs)
}

export default class Cookie {
  constructor(config = {}) {
    Cookies.defaults = config
  }

  setItem(key, value, config = {}) {
    const expires = config.expires
    if (expires && typeof expires === 'string') {
      config.expires = parseTimeStr(expires)
    }
    if (expires === Infinity) {
      config.expires = new Date('Fri, 31 Dec 9999 23:59:59 GMT')
    }

    return Cookies.set(key, value, config)
  }

  getItem(key) {
    return Cookies.getJSON(key)
  }

  removeItem(key, config) {
    return Cookies.remove(key, config)
  }

  clear() {
    [...parseCookie().keys()].forEach(key => {
      Cookies.remove(key)
    })
  }

  get length() {
    return parseCookie().size
  }

  key(index) {
    return [...parseCookie().keys()][index]
  }
}
