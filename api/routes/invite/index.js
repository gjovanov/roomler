const errorSchemas = require('../.common/error-schemas')
const inviteController = require('./invite-controller')
const inviteSchemas = require('./invite-schemas')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/invite/get',
  schema: {
    querystring: inviteSchemas.get.querystring,
    response: {
      200: inviteSchemas.get.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/invite/get-all',
  schema: {
    querystring: inviteSchemas.getAll.querystring,
    response: {
      200: inviteSchemas.getAll.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/invite/create',
  schema: {
    body: inviteSchemas.create.body,
    response: {
      200: inviteSchemas.create.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.create
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/update',
  schema: {
    body: inviteSchemas.update.body,
    response: {
      200: inviteSchemas.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/accept/:id',
  schema: {
    params: inviteSchemas.accept.params,
    response: {
      200: inviteSchemas.accept.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.accept
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/invite/reject/:id',
  schema: {
    params: inviteSchemas.reject.params,
    response: {
      200: inviteSchemas.reject.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.reject
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/invite/delete/:id',
  schema: {
    params: inviteSchemas.delete.params,
    response: {
      200: inviteSchemas.delete.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: inviteController.delete
}
]
