var symbolObject = function() {
  return this
}.call(Symbol('a'))
console.log(symbolObject.toString())
console.log({}.toString.call(symbolObject))
console.log(typeof Object(Symbol('a'))[Symbol.toPrimitive]())

var o = {
  valueOf() {
    console.log('valueof')
    return 234
  },

  toString() {
    console.log('toString')
    return 'toStringxx'
  },

  [Symbol.toStringTag]: 'MyObject'
}
console.log(o.toString())

function Parent() {
  console.log('===this: ', this.name)
}
Parent.prototype = {
  name: 'p'
}
const child = new Parent()
console.log(child.name)

console.log(new Date())
console.log(Date())

function f() {
  return { a: 'test' }
}
const f1 = new f()
console.log(f1)
const f2 = f()
console.log(f2.toString())

function cls() {
  this.a = 100
  console.log('===this====', Object.getPrototypeOf(this))
  return {
    getValue: () => this.a
  }
}
var o = new cls()
console.log('-----', o.getValue()) //100
console.log('---global--', global.a) //100
//a 在外面永远无法访问到

function MyNumber() {}
MyNumber.prototype = new Number()
console.log(new MyNumber())
