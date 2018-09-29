import Storage from '../src/storage'
import { deserialize } from '../src/helpers'

let inst = null

beforeAll(() => {
  inst = new Storage('local')
})

test('get a instance with storage prop by type param', () => {
  const instance1 = new Storage('local')
  expect(instance1.storage).toBe(window.localStorage)

  const instance2 = new Storage('session')
  expect(instance2.storage).toBe(window.sessionStorage)
})

describe('usage: setItem method', () => {
  test('passed a primitive value', () => {
    inst.setItem('name', 'test')
    expect(window.localStorage.getItem('name')).toBe('"test"')
  })

  test('passed an object', () => {
    const data = {
      name: 'test',
      value: [1, 2]
    }
    inst.setItem('object', data)
    expect(window.localStorage.getItem('object')).toBe(JSON.stringify(data))
  })

  test('passed an array', () => {
    const array = [1, 'a']
    inst.setItem('array', array)
    expect(window.localStorage.getItem('array')).toBe(JSON.stringify(array))
  })

  test('passed a config object as the third param when data contain `Function`, `Date`, `RegExp` type', () => {
    const data = {
      date: new Date(),
      regexp: /^jest/,
      fn: function (callback) { return callback() }
    }
    inst.setItem('specail', data, { isJSON: false })
    const data1 = deserialize(window.localStorage.getItem('specail'))
    expect(data1.date.getTime()).toBe(data.date.getTime())
    expect(data1.regexp.source).toBe(data.regexp.source)

    const mock = jest.fn()
    data1.fn(mock)
    expect(mock).toHaveBeenCalled()
  })
})

test('get an object when persisted data is an object', () => {
  inst.setItem('obj', { name: 'test' })
  expect(inst.getItem('obj')).toEqual({ name: 'test' })
})

test('get an array when persisted data is an array', () => {
  expect(inst.getItem('array')).toContain('a')
})

test('get correct value when persisted data is `Function`, `Date`, `RegExp`', () => {
  const data = {
    date: new Date(),
    regexp: /^jest/,
    fn: function (callback) { return callback() }
  }
  inst.setItem('specialobj', data, { isJSON: false })
  const { date, regexp, fn } = inst.getItem('specialobj')
  expect(date.getTime()).toEqual(data.date.getTime())
  expect('jest').toMatch(regexp)

  const mock = jest.fn()
  fn(mock)
  expect(mock).toHaveBeenCalled()
})

test('get length', () => {
  expect(inst.length).toBe(window.localStorage.length)
})

test('call key method with a index param', () => {
  expect(inst.key(0)).toBe('name')
})

test('call removeItem method with a key param', () => {
  expect(inst.getItem('name')).toBe('test')

  inst.removeItem('name')
  expect(inst.getItem('name')).toBeNull()
})

test('call removeItem method without param', () => {
  inst.removeItem()
  expect(inst.length).toBe(0)
})

test('call clear method', () => {
  inst.setItem('name', 'jest')
  expect(inst.length).toBe(1)

  inst.clear()
  expect(inst.length).toBe(0)
})
