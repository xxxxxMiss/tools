// 'use strict'
class BitMap {
  constructor() {
    this.bytes = new Array(1000).fill(0)
    this.nbits = 1000
  }

  set(k) {
    if (k > this.nbits) {
      return
    }

    const byteIndex = Math.floor(k / 16)
    const bitIndex = k % 16
    this.bytes[byteIndex] |= 1 << bitIndex
  }

  get(k) {
    if (k > this.nbits) return false
    const byteIndex = Math.floor(k / 16)
    const bitIndex = k % 16
    return (this.bytes[byteIndex] & (1 << bitIndex)) != 0
  }
}

function foo(x = 5) {
  return {
    next: () => {
      return {
        done: !x,
        value: x && x--,
      }
    },
  }
}

function rotate(nums, k) {
  k = k % nums.length
  let count = 0
  for (let start = 0; count < nums.length; start++) {
    let current = start
    let prev = nums[start]
    do {
      let next = (current + k) % nums.length
      let temp = nums[next]
      nums[next] = prev
      prev = temp
      current = next
      count++
      console.log('---->', nums)
    } while (start != current)
  }
  return nums
}

var generateParenthesis = function (n) {
  return generate(0, 0, n, '')
}

var groupAnagrams = function (strs) {
  const map = new Map()
  for (let str of strs) {
    const counts = new Array(26).fill(0)
    for (let s of str) {
      const index = s.charCodeAt(0) - 97
      counts[index]++
    }
    const key = counts.join('')
    if (map.has(key)) {
      map.get(key).push(str)
    } else {
      map.set(key, [str])
    }
  }
  return [...map.values()]
}

/**
 * @param {number[][]} M
 * @return {number}
 */
var findCircleNum = function (M) {}

class DisjointSet {
  constructor(n) {
    this.n = n
    this.parents = []
    for (let i = 0; i < n; ++i) {
      this.parents[i] = i
    }
  }

  find(x) {
    let p = x
    while (p != this.parents[p]) {
      p = this.parents[p]
    }
    return p
  }

  unionSet(x, y) {
    const xRes = this.find(x)
    const yRes = this.find(y)
    if (xRes != yRes) {
      this.parents[xRes] = yRes
    }
  }
}

let x = 9
const res = []
for (let i = 0; i < 32; ++i) {
  res[i] = x & 1
  x >>= 1
}
let ans = 0
for (let i = 1; i < 32; ++i) {
  ans <<= 1
  ans |= res[31 - i]
}

// 0 0 0 0
// 0 0 0 0
// 0 0 0 0
// 0 0 0 0
//直接的方法
const str = '56 74 65 100 99 68 86 90 180'

function test(str) {
  const nums = str.split(' ').map(num => {
    return {
      str: num,
      sum: getSum(num),
    }
    // return num * 1
    // return num
  })

  nums.sort((a, b) => {
    if (a.sum == b.sum) {
      return a.str > b.str
    }

    return a.sum - b.sum
    // const x = getSum(a)
    // const y = getSum(b)
    // if (x == y) return a > b
    // return x - y
  })
  return nums.map(item => item.str).join(' ')
}

function getSum(num) {
  let sum = 0
  for (let i = 0; i < num.length; ++i) {
    sum += num[i] * 1
  }
  return sum
}

// function bar() {
//   console.log('bar')
//   Promise.resolve().then(str => console.log('micro-bar'))
//   setTimeout(str => console.log('macro-bar'), 0)
// }

// function foo() {
//   console.log('foo')
//   Promise.resolve().then(str => console.log('micro-foo'))
//   setTimeout(str => console.log('macro-foo'), 0)

//   bar()
// }
// foo()
// console.log('global')
// Promise.resolve().then(str => console.log('micro-global'))
// setTimeout(str => console.log('macro-global'), 0)

// setTimeout(function () {
//   console.log(1)
// }, 0)
// new Promise(function executor(resolve) {
//   console.log(2)
//   for (var i = 0; i < 10000; i++) {
//     i == 9999 && resolve()
//   }
//   console.log(3)
// }).then(function () {
//   console.log(4)
// })
// Promise.resolve()
//   .then(() => {
//     console.log(2)
//     return new Promise(resolve => {
//       for (var i = 0; i < 10000; i++) {
//         i == 9999 && resolve()
//       }
//       console.log(3)
//     })
//   })
//   .then(() => {
//     console.log(4)
//   })
// console.log(5)

// setTimeout(() => {
//   console.log(0)
// })

// new Promise(resolve => {
//   resolve(1)

//   Promise.resolve().then(t => {
//     console.log(2)
//   })

//   console.log(3)
// }).then(t => {
//   console.log(t)
// })

// console.log(4)
// 3 4 2 1 0

// 4 3 1 2

function* getResult() {
  yield 'hello word'
  yield 'get_user_name'
  yield 'end'
}

const result = getResult()

function co(fn) {
  const result = fn()
  function walk(res) {
    const obj = res.next()
    console.log(obj.value)
    if (obj.done) return
    walk(res)
  }
  walk(result)
}

function HaveResolvePromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(100)
    }, 0)
  })
}
var wordBreak = function (s, wordDict) {
  let left = 0,
    right = 0
  const words = new Set(wordDict)
  while (right < s.length) {
    const sub = s.substring(left, right + 1)
    console.log('=======', sub, left, right)
    if (words.has(sub)) {
      left = right + 1
      right = left
    } else {
      right++
    }
  }
  return left >= s.length
}

const s = 'aaaaaab'
const dict = ['aaab', 'aaa']
console.log(wordBreak(s, dict))
