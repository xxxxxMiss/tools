interface Test<T = object> {
  data: T
  url: string
}

function request(config: Test): string {
  return config.url
}

function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
  return names.map(name => o[name])
}

interface Person {
  name: string
  age: number
}

let person: Person = {
  name: 'jackson',
  age: 35
}

pluck(person, ['name', 'age'])

type TestReadonly<T> = { readonly [P in keyof T]: T[P] }

type Keys = 'option1' | 'option2'
type Flags = { [K in Keys]: boolean }

interface Card {
  suit: string
  card: number
}
interface Deck {
  suits: string[]
  cards: number[]
  createCardPicker(this: Deck): () => Card
}
let deck: Deck = {
  suits: ['hearts', 'spades', 'clubs', 'diamonds'],
  cards: Array(52),
  // NOTE: The function now explicitly specifies that its callee must be of type Deck
  createCardPicker: function(this: Deck) {
    return () => {
      let pickedCard = Math.floor(Math.random() * 52)
      let pickedSuit = Math.floor(pickedCard / 13)

      return { suit: this.suits[pickedSuit], card: pickedCard % 13 }
    }
  }
}

let cardPicker = deck.createCardPicker()
let pickedCard = cardPicker()

alert('card: ' + pickedCard.card + ' of ' + pickedCard.suit)

type ParamType<T> = T extends (param: infer P) => any ? P : T

interface User {
  name: string
  age: number
}

type Func = (user: User) => void

type Param = ParamType<Func>
type AA = ParamType<string>

declare function test(...args: [string, number, boolean]): void

const args: [string, number, boolean] = ['42', 30, true]

test(...args)

declare function bind<T, U extends any[], V>(
  f: (x: T, ...args: U) => V,
  x: T
): (...args: U) => V
declare function f3(x: number, y: string, z: boolean): void

const f2 = bind(f3, 2)

let t: [number, string?, boolean?]

t = [42]

t = [42, '1']

t = [42, '21', true]

function tuple<T extends any[]>(...args: T): T {
  return args
}

const numbers: number[] = [1, 2, 3]

tuple('foo', 1, true)
tuple('bar', ...numbers)

type Head<Tuple extends any[]> = Tuple extends [infer H, ...any[]] ? H : never

// type Tail<Tuple extends any[]> = Tuple extends [any, infer R] ? R : never;

// type x = Tail<[1, 2, 3, 4]>; // never

type Tail<Tuple extends any[]> = ((...x: Tuple) => void) extends ((
  h: any,
  ...rest: infer R
) => void)
  ? R
  : never

type x = Tail<[1, 2, 3, 4]> // never

const defaultOption = {
  timeout: 500
}
type Opt = typeof defaultOption

interface Dinner1 {
  fish?: number
  bear?: number
}

// 🙂 Awesome!
type Dinner2 =
  | {
      fish: number
    }
  | {
      bear: number
    }

let d1: Dinner1 = {}
d1.fish = 1
d1.bear = 2

let d2: Dinner2 = { bear: 1 }

interface API {
  '/user': { name: string }
  '/menu': { food: any[] }
}

const get = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then(res => res.json())
}

const get2 = <URL extends keyof API>(url: URL): Promise<API[URL]> => {
  return fetch(url).then(res => res.json())
}

function getById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id)
}

type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> }

const a = { foo: { bar: 22 } }
const b = a as DeepReadonly<typeof a>
b.foo.bar = 33 // Hey, stop!

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

class Greeter {
  greeting: string
  constructor(message: string) {
    this.greeting = message
  }

  @enumerable(false)
  greet() {
    return 'hello, ' + this.greeting
  }
}

function enumerable(value: boolean) {
  return function(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    console.log(arguments)
    descriptor.enumerable = value
  }
}

const gt = new Greeter('jim')
const propdescriptor = Object.getOwnPropertyDescriptor(gt, 'greet')
console.log(propdescriptor)
