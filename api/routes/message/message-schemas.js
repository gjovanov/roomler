const S = require('fluent-schema')
const config = require('../../../config')

const types = config.dataSettings.message.types

const getQueryString = S.object()
  .prop('id', S.string().required())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('roomid', S.string())

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('isactive', S.boolean().required())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', S.string())
  .prop('roomid', S.number())
  .prop('name', S.string())
  .prop('moderators', S.array().items(S.string()))
  .prop('reactions', S.array().items(S.string()))
  .prop('members', S.array().items(S.string()))

const reaction = S.object()
  .prop('user', S.string().required())
  .prop('type', S.string().required())
  .prop('reaction', S.object())

const message = S.object()
  .prop('_id', S.string())
  .prop('author', user)
  .prop('room', room)
  .prop('type', S.string())
  .prop('content', S.string())
  .prop('parent', S.string())
  .prop('mentions', S.array().items(S.string()))
  .prop('reactions', S.array().items(reaction))
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const messageList = S.array().items(message)

const createBody = S.object()
  .prop('room', S.string().required())
  .prop('type', S.string().required())
  .prop('content', S.string().required())
const createBodyItems = S.array().items(createBody)

const inviteUpdate = S.object()
  .prop('name', S.string())
  .prop('email', S.string())
  .prop('type', S.string().enum(types))

const updateBody = S.object()
  .prop('id', S.string().required())
  .prop('update', inviteUpdate)

const idParam = S.object()
  .prop('id', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

const reactionPush = S.object()
  .prop('id', S.string().required())
  .prop('type', S.string().required())
  .prop('reaction', S.object())

const reactionPull = S.object()

module.exports = {
  get: {
    querystring: getQueryString,
    response: {
      200: message
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: messageList
    }
  },
  create: {
    body: createBodyItems,
    response: {
      200: messageList
    }
  },
  update: {
    body: updateBody,
    response: {
      200: message
    }
  },
  delete: {
    params: idParam,
    response: {
      200: delete200
    }
  },
  reactions: {
    push: {
      body: reactionPush,
      response: {
        200: message
      }
    },
    pull: {
      body: reactionPull,
      response: {
        200: message
      }
    }
  }
}
