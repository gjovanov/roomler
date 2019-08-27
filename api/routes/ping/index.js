const errorSchemas = require('../.common/error-schemas')
const pingController = require('./ping-controller')
const pingSchemas = require('./ping-schemas')

module.exports = [{
  method: 'GET',
  url: '/api/ping',
  schema: {
    response: {
      200: pingSchemas.ping.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: pingController.doPing
}]
