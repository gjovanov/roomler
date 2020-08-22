const {
  join
} = require('path')
const {
  renameSync,
  existsSync,
  mkdirSync
} = require('fs')
const multer = require('fastify-multer')
const errorSchema = require('../.common/error-schema')
const roomController = require('./room-controller')
const roomOwnerController = require('./room-owner-controller')
const roomMembersController = require('./room-members-controller')
const roomModeratorsController = require('./room-moderators-controller')
const roomCallsController = require('./room-calls-controller')
const roomSchema = require('./room-schema')

// folders
const staticFolder = join(__dirname, '../../../ui/static')
const uploadsFolder = join(staticFolder, 'uploads')

const storage = multer.diskStorage({
  destination (req, file, callback) {
    callback(null, uploadsFolder)
  },
  filename (req, file, callback) {
    const fileComponents = file.originalname.split('.')
    const fileExtension = fileComponents[fileComponents.length - 1]
    const filename = `${file.originalname}_${Date.now()}.${fileExtension}`
    callback(null, filename)
  }
})
const upload = multer({ storage })

module.exports = [{
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
  method: 'GET',
  url: '/api/room/explore',
  schema: {
    querystring: roomSchema.explore.querystring,
    response: {
      200: roomSchema.explore.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomController.explore
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
  method: 'POST',
  url: '/api/room/upload',
  preHandler: upload.single('file'),
  handler (request, reply) {
    const roomFolder = join(uploadsFolder, request.body.room)
    if (!existsSync(roomFolder)) {
      mkdirSync(roomFolder)
    }
    if (request.file) {
      const oldPath = join(uploadsFolder, request.file.filename)
      const newPath = join(roomFolder, request.file.filename)
      renameSync(oldPath, newPath)
      reply.code(200).send({
        src: `/uploads/${request.body.room}/${request.file.filename}`
      })
    } else {
      reply.code(200).send({
        src: ''
      })
    }
  }
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/owner/transfer/:id',
  schema: {
    params: roomSchema.owner.transfer.params,
    body: roomSchema.owner.transfer.body,
    response: {
      200: roomSchema.owner.transfer.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomOwnerController.transfer
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/room/members/switch/:id',
  schema: {
    params: roomSchema.members.switch.params,
    body: roomSchema.members.switch.body,
    response: {
      200: roomSchema.members.switch.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomMembersController.switch
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
  url: '/api/room/moderators/switch/:id',
  schema: {
    params: roomSchema.moderators.switch.params,
    body: roomSchema.moderators.switch.body,
    response: {
      200: roomSchema.moderators.switch.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomModeratorsController.switch
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
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/room/calls/get-all',
  schema: {
    response: {
      200: roomSchema.calls.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomCallsController.getAll
},
{
  authenticate: true,
  admin: true,
  method: 'GET',
  url: '/api/room/calls/get-reports',
  schema: {
    response: {
      200: roomSchema.calls.getReports.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomCallsController.getReports
},
{
  authenticate: true,
  method: 'POST',
  url: '/api/room/calls/pull/:id',
  schema: {
    params: roomSchema.calls.params,
    response: {
      200: roomSchema.calls.pull.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: roomCallsController.pull
}
]
