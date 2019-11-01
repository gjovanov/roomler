const config = require('../../../config')

const upstream = `${config.appSettings.env.API_URL}/api`
const options = {
  upstream,
  prefix: '/api/v1', // optional,
  rewritePrefix: '/api',
  http2: false // optional
}
module.exports = options
