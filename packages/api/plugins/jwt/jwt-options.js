const {
  readFileSync
} = require('fs')
const path = require('path')
module.exports = {
  secret: {
    private: readFileSync(`${path.join(__dirname, '..', '..', 'certs', 'jwt-RS256.key')}`, 'utf8'),
    public: readFileSync(`${path.join(__dirname, '..', '..', 'certs', 'jwt-RS256.key.pub')}`, 'utf8')
  },
  sign: {
    algorithm: 'RS256',
    expiresIn: '14d'
  }
}
