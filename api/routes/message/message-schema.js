const S = require('fluent-schema')
const config = require('../../../config')
const types = config.dataSettings.message.types

const getQueryString = S.object()
  .prop('id', S.string().required())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('room', S.string())

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', S.string())
  .prop('name', S.string())
  .prop('moderators', S.array().items(S.string()))
  .prop('members', S.array().items(S.string()))

const reaction = S.object()
  .prop('user', user)
  .prop('type', S.string().required())
  .prop('reaction', S.object())

const message = S.object()
  .prop('_id', S.string())
  .prop('author', user)
  .prop('room', room)
  .prop('type', S.string())
  .prop('content', S.string())
  .prop('parent', S.string())
  .prop('mentions', S.array().items(user))
  .prop('readby', S.array().items(user))
  .prop('reactions', S.array().items(reaction))
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const messageList = S.array().items(message)

const messageItem = S.object()
  .prop('parent', S.string())
  .prop('type', S.string().enum(types))
  .prop('content', S.string().required())
  .prop('mentions', S.array().items(S.string()))

const messageItems = S.array().items(messageItem)

const createBody = S.object()
  .prop('room', S.string().required())
  .anyOf([
    S.ifThen(S.object().prop('message', S.object()), S.object().prop('message', messageItem)),
    S.ifThen(S.object().prop('message', S.array()), S.object().prop('message', messageItems))
  ])

const messageUpdate = S.object()
  .prop('content', S.string())
  .prop('mentions', S.array().items(S.string()))

const idParam = S.object()
  .prop('id', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

const reactionPush = S.object()
  .prop('type', S.string().required())
  .prop('reaction', S.object())

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
    body: createBody,
    response: {
      200: messageList
    }
  },
  update: {
    params: idParam,
    body: messageUpdate,
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
  readby: {
    push: {
      params: idParam,
      response: {
        200: message
      }
    },
    pull: {
      params: idParam,
      response: {
        200: message
      }
    }
  },
  reactions: {
    push: {
      params: idParam,
      body: reactionPush,
      response: {
        200: message
      }
    },
    pull: {
      params: idParam,
      response: {
        200: message
      }
    }
  }
}
