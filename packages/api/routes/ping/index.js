const errorSchema = require('../.common/error-schema')
const pingController = require('./ping-controller')
const pingSchema = require('./ping-schema')

module.exports = [{
  method: 'GET',
  url: '/api/ping',
  schema: {
    response: {
      200: pingSchema.ping.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: pingController.ping
}]
