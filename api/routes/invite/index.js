const errorSchema = require('../.common/error-schema')
const inviteController = require('./invite-controller')
const inviteSchema = require('./invite-schema')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/invite/get',
  schema: {
    querystring: inviteSchema.get.querystring,
    response: {
      200: inviteSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/invite/get-all',
  schema: {
    querystring: inviteSchema.getAll.querystring,
    response: {
      200: inviteSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/invite/create',
  schema: {
    body: inviteSchema.create.body,
    response: {
      200: inviteSchema.create.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.create
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/update/:id',
  schema: {
    body: inviteSchema.update.body,
    response: {
      200: inviteSchema.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/accept/:id',
  schema: {
    params: inviteSchema.accept.params,
    response: {
      200: inviteSchema.accept.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.accept
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/reject/:id',
  schema: {
    params: inviteSchema.reject.params,
    response: {
      200: inviteSchema.reject.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.reject
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/invite/delete/:id',
  schema: {
    params: inviteSchema.delete.params,
    response: {
      200: inviteSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: inviteController.delete
}
]
