const S = require('fluent-schema')
const config = require('roomler.config')
const types = config.dataSettings.message.types

const getQueryString = S.object()
  .prop('id', S.string().required())

const ids = S.array().items(S.string())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('room', S.string())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', S.string())
  .prop('name', S.string())
  .prop('path', S.string())
  .prop('emoji', S.string())
  .prop('is_open', S.boolean())
  .prop('moderators', S.array().items(S.string()))
  .prop('members', S.array().items(S.string()))

const reaction = S.object()
  .prop('user', S.string())
  .prop('name', S.string())
  .prop('symbol', S.string())

const reactionPush = S.object()
  .prop('name', S.string().required())
  .prop('symbol', S.string().required())

const message = S.object()
  .prop('_id', S.string())
  .prop('author', S.string())
  .prop('room', room)
  .prop('client_id', S.string())
  .prop('type', S.string())
  .prop('content', S.string())
  .prop('parent', S.string())
  .prop('is_read', S.boolean())
  .prop('has_mention', S.boolean())
  .prop('mentions', S.array().items(S.string()))
  .prop('reactions', S.array().items(reaction))
  .prop('has_reaction', S.boolean())
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const messageList = S.array().items(message)

const wsMessage = S.object()
  .prop('op')
  .prop('data', messageList)

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

module.exports = {
  wsMessage,
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
    pushAll: {
      body: ids,
      response: {
        200: messageList
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
