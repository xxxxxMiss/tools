const arr = [1, '1', 2, 2, 'a', 1]
// hello world
// [1, '1', 2]
hello world
hello world

const fn = arrs => {
  let ret = []
  let i = 0
  let j = 1
  for (; i < arrs.length; i++) {
    if (arrs[i] == arrs[j]) {
      ret.push(arrs[i])
      i++
      j = i
    }
  }
  return ret
}

function clone(obj) {
  if (Array.isArray(obj)) {
    return obj.map(clone)
  } else {
    return obj
  }
}

console.log(clone(arr))

// console.log(JSON.parse(JSON.stringify({ name: 'test', x: function() {} })))

function log(...args) {
  return console.log(...args)
}

function Super(age) {
  this.names = []
  this.age = age
}

function Sub(age) {
  Super.call(this, age)
}

function create(object) {
  function F() {}
  F.prototype = object
  return new F()
}

Sub.prototype = create(Super.prototype)

log(new Sub('gg').age)
