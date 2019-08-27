const errorSchemas = require('../.common/error-schemas')
const messageController = require('./message-controller')
const messageReactionsController = require('./message-reactions-controller')
const messageSchemas = require('./message-schemas')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/message/get',
  schema: {
    querystring: messageSchemas.get.querystring,
    response: {
      200: messageSchemas.get.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/message/get-all',
  schema: {
    querystring: messageSchemas.getAll.querystring,
    response: {
      200: messageSchemas.getAll.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/message/create',
  schema: {
    body: messageSchemas.create.body,
    response: {
      200: messageSchemas.create.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageController.create
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/update',
  schema: {
    body: messageSchemas.update.body,
    response: {
      200: messageSchemas.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageController.update
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/message/delete/:id',
  schema: {
    params: messageSchemas.delete.params,
    response: {
      200: messageSchemas.delete.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageController.delete
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/reactions/push',
  schema: {
    body: messageSchemas.reactions.push.body,
    response: {
      200: messageSchemas.reactions.push.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageReactionsController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/reactions/pull',
  schema: {
    body: messageSchemas.reactions.pull.body,
    response: {
      200: messageSchemas.reactions.pull.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: messageReactionsController.pull
}
]
