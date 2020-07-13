
const errorSchema = require('../.common/error-schema')
const visitController = require('./visit-controller')
const visitSchema = require('./visit-schema')

module.exports = [
  {
    authenticate: true,
    admin: true,
    method: 'GET',
    url: '/api/visit/get-all',
    schema: {
      querystring: visitSchema.getAll.querystring,
      response: {
        200: visitSchema.getAll.response[200],
        409: errorSchema.response[409],
        500: errorSchema.response[500]
      }
    },
    handler: visitController.getAll
  }
]
