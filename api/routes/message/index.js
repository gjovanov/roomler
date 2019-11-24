const errorSchema = require('../.common/error-schema')
const messageController = require('./message-controller')
const messageReadbyController = require('./message-readby-controller')
const messageReactionsController = require('./message-reactions-controller')
const messageSchema = require('./message-schema')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/message/get',
  schema: {
    querystring: messageSchema.get.querystring,
    response: {
      200: messageSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/message/get-all',
  schema: {
    querystring: messageSchema.getAll.querystring,
    response: {
      200: messageSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/message/create',
  schema: {
    body: messageSchema.create.body,
    response: {
      200: messageSchema.create.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageController.create,
  wsHandler: messageController.createWs
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/update/:id',
  schema: {
    params: messageSchema.update.params,
    body: messageSchema.update.body,
    response: {
      200: messageSchema.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageController.update
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/message/delete/:id',
  schema: {
    params: messageSchema.delete.params,
    response: {
      200: messageSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageController.delete
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/readby/push/:id',
  schema: {
    params: messageSchema.readby.push.params,
    response: {
      200: messageSchema.readby.push.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageReadbyController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/readby/pushAll',
  schema: {
    body: messageSchema.readby.pushAll.body,
    response: {
      200: messageSchema.readby.pushAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageReadbyController.pushAll
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/readby/pull/:id',
  schema: {
    params: messageSchema.readby.pull.params,
    response: {
      200: messageSchema.readby.pull.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageReadbyController.pull
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/reactions/push/:id',
  schema: {
    params: messageSchema.reactions.push.params,
    body: messageSchema.reactions.push.body,
    response: {
      200: messageSchema.reactions.push.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageReactionsController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/message/reactions/pull/:id',
  schema: {
    params: messageSchema.reactions.pull.params,
    response: {
      200: messageSchema.reactions.pull.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: messageReactionsController.pull
}
]
