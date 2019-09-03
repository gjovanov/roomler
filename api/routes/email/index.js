const errorSchema = require('../.common/error-schema')
const emailController = require('./email-controller')
const emailSchema = require('./email-schema')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/email/get',
  schema: {
    querystring: emailSchema.get.querystring,
    response: {
      200: emailSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: emailController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/email/get-all',
  schema: {
    querystring: emailSchema.getAll.querystring,
    response: {
      200: emailSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: emailController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/email/send',
  schema: {
    body: emailSchema.send.body,
    response: {
      200: emailSchema.send.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: emailController.send
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/email/delete/:id',
  schema: {
    params: emailSchema.delete.params,
    response: {
      200: emailSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: emailController.delete
}
]
