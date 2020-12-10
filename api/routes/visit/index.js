
const errorSchema = require('../.common/error-schema')
const visitController = require('./visit-controller')
const visitSchema = require('./visit-schema')

module.exports = [
  {
    authenticate: true,
    admin: true,
    method: 'GET',
    url: '/api/visit/get-stats',
    schema: {
      querystring: visitSchema.getStats.querystring,
      response: {
        200: visitSchema.getStats.response[200],
        409: errorSchema.response[409],
        500: errorSchema.response[500]
      }
    },
    handler: visitController.getStats
  }
]
