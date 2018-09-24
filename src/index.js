/**
 *  created at 2018/08/14 11:56 by xxxxxMiss
 */
import Storage from './storage'
import Cookie from './cookie'

const types = ['local', 'session', 'cookie']
let storageInstances = {}

export default function persist(options = {}) {
  const type = typeof options === 'string'
    ? options
    : options.storage

  if (!types.includes(type)) {
    throw TypeError(`invalid type: ${type}, available types is ${types.join(',')}`)
  }

  if (storageInstances[type]) {
    return storageInstances[type]
  }

  return type === 'cookie'
    ? (storageInstances[type] = new Cookie())
    : (storageInstances[type] = new Storage(type))
}
