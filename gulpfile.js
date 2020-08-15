const http = require('http')

const server = http.createServer((req, res) => {
  res.end('abcd')
})

server.listen('127.0.0.1', () => {
  console.log('serve has started...')
})
