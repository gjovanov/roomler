const errorSchema = require('../.common/error-schema')
const roomController = require('./room-controller')
const roomMembersController = require('./room-members-controller')
const roomModeratorsController = require('./room-moderators-controller')
const roomSchema = require('./room-schema')

module.exports = [{
  authenticate: true,
  method: 'GET',
  url: '/api/room/get',
  schema: {
    querystring: roomSchema.get.querystring,
    response: {
      200: roomSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.get
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/room/get-all',
  schema: {
    querystring: roomSchema.getAll.querystring,
    response: {
      200: roomSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.getAll
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/room/create',
  schema: {
    body: roomSchema.create.body,
    response: {
      200: roomSchema.create.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.create
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/update/:id',
  schema: {
    params: roomSchema.update.params,
    body: roomSchema.update.body,
    response: {
      200: roomSchema.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.update
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/room/delete/:id',
  schema: {
    params: roomSchema.delete.params,
    response: {
      200: roomSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.delete
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/push/:id',
  schema: {
    params: roomSchema.members.push.params,
    body: roomSchema.members.push.body,
    response: {
      200: roomSchema.members.push.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomMembersController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/update/:id',
  schema: {
    params: roomSchema.members.update.params,
    body: roomSchema.members.update.body,
    response: {
      200: roomSchema.members.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomMembersController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/pull/:id',
  schema: {
    params: roomSchema.members.pull.params,
    body: roomSchema.members.pull.body,
    response: {
      200: roomSchema.members.pull.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomMembersController.pull
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/push/:id',
  schema: {
    params: roomSchema.moderators.push.params,
    body: roomSchema.moderators.push.body,
    response: {
      200: roomSchema.moderators.push.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomModeratorsController.push
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/update/:id',
  schema: {
    params: roomSchema.moderators.update.params,
    body: roomSchema.moderators.update.body,
    response: {
      200: roomSchema.moderators.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomModeratorsController.update
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/moderators/pull/:id',
  schema: {
    params: roomSchema.moderators.pull.params,
    body: roomSchema.moderators.pull.body,
    response: {
      200: roomSchema.moderators.pull.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomModeratorsController.pull
}
]
