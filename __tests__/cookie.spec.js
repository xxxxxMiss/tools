import Cookie from '../src/cookie'

jest.setTimeout(10000)

let inst = null
beforeAll(() => {
  inst = new Cookie()
})
afterAll(() => {
  inst = null
})

describe('setItem(key, value, config)', () => {
  test('without config param', () => {
    inst.setItem('name', 'test')
    expect(inst.getItem('name')).toBe('test')
  })

  test('value is an array', () => {
    inst.setItem('array', [1, 2, 'a', 'b'])
    expect(inst.getItem('array')).toContain('a')
  })

  test('value is an object', () => {
    inst.setItem('obj', {
      name: 'jest',
      age: 10
    })
    expect(inst.getItem('obj')).toHaveProperty('age', 10)
  })

  test('config.expires is a readable string', (done) => {
    inst.setItem('male', 'one', {
      expires: '3s'
    })
    inst.setItem('female', 'two', {
      expires: '3d'
    })
    expect(document.cookie).toContain(encodeURIComponent(inst.getItem('male')))
    expect(document.cookie).toContain(encodeURIComponent(inst.getItem('female')))
    setTimeout(() => {
      expect(inst.getItem('male')).toBeUndefined()
      expect(inst.getItem('female')).toBe('two')
      done()
    }, 4000)
  })
})

describe('getItem(key)', () => {
  test('get parsed data', () => {
    expect(inst.getItem('name')).toBe('test')
    expect(inst.getItem('obj')).toMatchObject({ name: 'jest' })
  })

  test('get parsed data without key', () => {
    expect(inst.getItem()).toMatchObject({
      name: 'test',
      array: [1, 2, 'a', 'b'],
      obj: {
        name: 'jest',
        age: 10
      }
    })
  })

  test('get correct values with simulating refresh page', () => {
    const newInst = new Cookie()
    expect(newInst.getItem('name')).toBe('test')
    expect(newInst.getItem('obj')).toMatchObject({
      name: 'jest',
      age: 10
    })
    expect(newInst.length()).toBe(document.cookie.split(/;\s*/).length)
  })
})

test('length(): get the size of cookies', () => {
  expect(inst.length()).toBe(document.cookie.split(/;\s*/).length)
})

test('key(index): get the key with the specified index', () => {
  expect(inst.key(0)).toBe('name')
})

toString('clear(): remove all cookies with default config', () => {
  inst.clear()
  expect(inst.length()).toBe(1)
})
