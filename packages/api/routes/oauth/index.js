const errorSchema = require('../.common/error-schema')
const oAuthController = require('./oauth-controller')
const oAuthSchema = require('./oauth-schema')

module.exports = [{
  method: 'GET',
  url: '/api/oauth/get-or-create',
  schema: {
    querystring: oAuthSchema.getOrCreate.querystring,
    response: {
      200: oAuthSchema.getOrCreate.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: oAuthController.getOrCreate
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/oauth/get-all',
  schema: {
    querystring: oAuthSchema.getAll.querystring,
    response: {
      200: oAuthSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: oAuthController.getAll
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/oauth/update/:id',
  schema: {
    params: oAuthSchema.update.params,
    body: oAuthSchema.update.body,
    response: {
      200: oAuthSchema.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: oAuthController.update
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/oauth/delete/:id',
  schema: {
    params: oAuthSchema.delete.params,
    response: {
      200: oAuthSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: oAuthController.delete
}
]
