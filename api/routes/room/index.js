const errorSchemas = require('../.common/error-schemas')
const roomController = require('./room-controller')
const roomMembersController = require('./room-members-controller')
const roomModeratorsController = require('./room-moderators-controller')
const roomSchemas = require('./room-schemas')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/room/get',
  schema: {
    querystring: roomSchemas.get.querystring,
    response: {
      200: roomSchemas.get.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/room/get-all',
  schema: {
    querystring: roomSchemas.getAll.querystring,
    response: {
      200: roomSchemas.getAll.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/room/create',
  schema: {
    body: roomSchemas.create.body,
    response: {
      200: roomSchemas.create.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomController.create
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/update',
  schema: {
    body: roomSchemas.update.body,
    response: {
      200: roomSchemas.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomController.update
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/room/delete/:id',
  schema: {
    params: roomSchemas.delete.params,
    response: {
      200: roomSchemas.delete.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomController.delete
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/push',
  schema: {
    body: roomSchemas.members.push.body,
    response: {
      200: roomSchemas.members.push.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomMembersController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/update',
  schema: {
    body: roomSchemas.members.update.body,
    response: {
      200: roomSchemas.members.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomMembersController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/pull',
  schema: {
    body: roomSchemas.members.pull.body,
    response: {
      200: roomSchemas.members.pull.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomMembersController.pull
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/push',
  schema: {
    body: roomSchemas.moderators.push.body,
    response: {
      200: roomSchemas.moderators.push.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomModeratorsController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/update',
  schema: {
    body: roomSchemas.moderators.update.body,
    response: {
      200: roomSchemas.moderators.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomModeratorsController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/pull',
  schema: {
    body: roomSchemas.moderators.pull.body,
    response: {
      200: roomSchemas.moderators.pull.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: roomModeratorsController.pull
}
]
