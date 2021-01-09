// const config = require('roomler.config')

// const upstream = `${config.appSettings.env.API_URL}/api`
const options = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}
module.exports = options
