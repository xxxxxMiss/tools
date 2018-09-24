import persist from '../src'
import Cookie from '../src/cookie'
import Storage from '../src/storage'

let instant = null
beforeAll(() => {
  instant = persist({ storage: 'local' })
})
afterAll(() => {
  instant = null
})

describe('persist(options)', () => {
  test('passed options.storage get an instance', () => {
    expect(instant).toBeInstanceOf(Storage)
  })

  test('don`t create new instance when type is the small to previously', () => {
    const newInstant = persist({ storage: 'local' })
    expect(newInstant === instant).toBeTruthy()

    const cookieInstant = persist({ storage: 'cookie' })
    expect(cookieInstant).toBeInstanceOf(Cookie)
  })
})

test('options can be a string represent a type', () => {
  const storage = persist('session')
  expect(storage.getItem).toBeDefined()
})
