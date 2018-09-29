import serialize from 'serialize-javascript'
import { parseTimeStr, deserialize } from '../src/helpers'

let d = null
beforeAll(() => {
  d = new Date()
})
afterAll(() => {
  d = null
})

describe('deserialize(serializedStr)', () => {
  test('deserialize when serialize a normal type', () => {
    const serializedStr = serialize('jest')
    expect(serializedStr).toBe('"jest"')
    expect(deserialize(serializedStr)).toBe('jest')
  })

  test('deserialize when serialize an object', () => {
    const data = {
      name: 'jest'
    }
    const serializedStr = serialize(data)

    expect(serializedStr).toBe(JSON.stringify(data))
    expect(deserialize(serializedStr)).toEqual(data)
  })

  test('deserialize when serialize an object with special type', () => {
    const data = {
      date: new Date(),
      regexp: /^jest/,
      fn: function (callback) { callback() }
    }
    const serializedStr = serialize(data)
    const parsed = deserialize(serializedStr)

    expect(parsed.date).toBeInstanceOf(Date)
    expect('jest').toMatch(parsed.regexp)

    const mock = jest.fn()
    parsed.fn(mock)
    expect(mock).toHaveBeenCalled()
  })
})

describe('parseTimeStr(str)', () => {
  test('years/year/yrs/yr/y', () => {
    const date1 = parseTimeStr('1y')
    expect(date1.getFullYear()).toBe(d.getFullYear() + 1)

    const date2 = parseTimeStr('2yrs')
    expect(date2.getFullYear()).toBe(d.getFullYear() + 2)
  })

  test('weeks/week/w', () => {
    const date1 = parseTimeStr('1w')
    expect(date1.getDay()).toBe(d.getDay())

    const date2 = parseTimeStr('2weeks')
    expect(date2.getDay()).toBe(d.getDay())
  })

  test('days/day/d', () => {
    const date1 = parseTimeStr('1d')
    expect([1, d.getDate() + 1]).toContain(date1.getDate())
  })

  test('hours/hrs/hr/h', () => {
    const date1 = parseTimeStr('1h')
    expect([0, d.getHours() + 1]).toContain(date1.getHours())
  })

  test('minutes/minute/mins/min/m', () => {
    const date1 = parseTimeStr('1m')
    expect([0, d.getMinutes() + 1]).toContain(date1.getMinutes())
  })

  test('seconds/second/secs/sec/s', () => {
    const date1 = parseTimeStr('1s')
    expect([0, d.getSeconds() + 1]).toContain(date1.getSeconds())
  })

  test('milliseconds/millsecond/msecs/msec/ms', () => {
    expect(parseTimeStr('10ms').getMilliseconds()).toBeGreaterThanOrEqual(d.getMilliseconds())
  })

  test('throw an error when passed an invalid string', () => {
    expect(() => parseTimeStr('')).toThrow(/^invalid param/)
    expect(() => parseTimeStr()).toThrow(/^invalid param/)
    expect(() => parseTimeStr(null)).toThrow(/^invalid param/)
  })
})
