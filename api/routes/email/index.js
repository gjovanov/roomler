const errorSchemas = require('../.common/error-schemas')
const emailController = require('./email-controller')
const emailSchemas = require('./email-schemas')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/email/get',
  schema: {
    querystring: emailSchemas.get.querystring,
    response: {
      200: emailSchemas.get.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: emailController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/email/get-all',
  schema: {
    querystring: emailSchemas.getAll.querystring,
    response: {
      200: emailSchemas.getAll.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: emailController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/email/send',
  schema: {
    body: emailSchemas.send.body,
    response: {
      200: emailSchemas.send.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: emailController.send
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/email/delete/:id',
  schema: {
    params: emailSchemas.delete.params,
    response: {
      200: emailSchemas.delete.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: emailController.delete
}
]
