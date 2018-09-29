# persistentjs

> use universal api to operate cookie,localStorage and sessionStorage

[![Build Status](https://img.shields.io/travis/xxxxxMiss/ic-persistentjs/master.svg)](https://travis-ci.org/xxxxxMiss/ic-persistentjs)
[![NPM](https://img.shields.io/npm/v/ic-persistentjs.svg)](https://www.npmjs.com/package/ic-persistentjs)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://opensource.org/licenses/MIT)


### Install
>$ npm i ic-persistentjs || yarn add ic-persistentjs

### Usage

```js
import persistent from 'ic-persistentjs'
 // type is a enum string: 'local', 'session', 'cookie'
const storage = persistent(type)
```

### api

- storage.setItem(key, value, options)
> use it same as native `setItem` on `localStorage`, but we enhanced it by passing an `options` as the third param.

when `type` is `local` or `session` and your persisted data contains some special data type like `RegExp`、 `Date` and `Function`, you can set `options.isJSON` to `false`.

```js
storage.setItem('special', {
  date: new Date(),
  regexp: /test/,
  fn: function () {}
}, { isJSON: false })
```

when `type` is 'cookie', `options` supports these properties:

#### options.expires
> set when the cookie will be removed. It can be a string, number and Date.

string:
```js
storage.setItem('name', 'tom', {
  expires: '7d' // '7days' or '7day'
})
```

available semantic string as below:

- 'years/year/yrs/yr/y'
- 'weeks/week/w'
- 'days/day/d'
- 'hours/hour/hrs/hr/h'
- 'minutes/minute/mins/min/m'
- 'seconds/second/secs/sec/s'
- 'milliseconds/millisecond/msecs/msec/ms'

number:
```js
storage.setItem('name', 'tom', {
  expires: 7 // represent 7 days, as the same as '7days'|'7day'|'7d'
})
```

Date:

```js
storage.setItem('name', 'tom', {
  expires: new Date(2088, 08, 08) // represent 7 days, as the same as '7days'|'7day'|'7d'
})
```

#### options.path
#### options.domain
#### options.secure
More informations about these options above, [see here](https://github.com/js-cookie/js-cookie).

### getItem(key)
> Get a json data with the key, or get all data without key(only available when type is cookie).

```js
// type is 'local' or 'session'
// return null when not found the value of the key.
storage.getItem('name')

// when type is 'cookie', return all data without key.
// return a empty object when not found the value of the key.
storage.setiItem('name', 'test')
storage.setiItem('obj', {
  name: 'test',
  age: 30
})
storage.getItem('name') // output: 'test'
storage.getItem() // output: {name: 'test', obj: { name: 'test, age: 30 }}
```

### removeItem(key, options)
> `options` is available only when type is cookie.

```js
storage.removeItem('name')

// when type is 'cookie'
storage.removeItem('name', {
  path: '/path',
  domain: 'sub.domain.com'
})
```

### clear()
> remove all data.

```js
storage.clear()
```

### key(index)
> the same as the key method of `localStorage`.

```js
storage.index(0)
```

### length
> like the length property of `localStorage`.

```js
storage.length
```
