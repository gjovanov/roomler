const {
  readFileSync
} = require('fs')
const path = require('path')
module.exports = {
  https: {
    // allowHTTP1: true, // fallback support for HTTP1
    key: readFileSync(`${path.join(__dirname, '..', '..', 'certs', 'server.key')}`, 'utf8'),
    cert: readFileSync(`${path.join(__dirname, '..', '..', 'certs', 'server.crt')}`, 'utf8')
  }
}
