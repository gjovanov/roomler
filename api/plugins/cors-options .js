// const config = require('../../config')

// const upstream = `${config.appSettings.env.API_URL}/api`
const options = {
  origin: '*',
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true
}
module.exports = options
