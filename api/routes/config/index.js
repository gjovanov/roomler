const errorSchema = require('../.common/error-schema')
const configController = require('./config-controller')
const configSchema = require('./config-schema')

module.exports = [{
  method: 'GET',
  url: '/api/config/get',
  schema: {
    response: {
      200: configSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: configController.get
}]
