import serialize from 'serialize-javascript'
import { deserialize } from './helpers'

export default class Storage {
  constructor(type) {
    if (type === 'local') {
      this.storage = window.localStorage
    }
    if (type === 'session') {
      this.storage = window.sessionStorage
    }
  }

  setItem(key, value, config = {}) {
    config = Object.assign({}, { isJSON: true }, config)
    return this.storage.setItem(key, serialize(value, config))
  }

  getItem(key) {
    const data = this.storage.getItem(key)
    return data ? deserialize(data) : null
  }

  removeItem(key) {
    return key ? this.storage.removeItem(key) : this.storage.clear()
  }

  clear() {
    return this.storage.clear()
  }

  get length() {
    return this.storage.length
  }

  key(index) {
    return this.storage.key(index)
  }
}
