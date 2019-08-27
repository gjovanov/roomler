const S = require('fluent-schema')

const getQueryString = S.object()
  .prop('id', S.string().required())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('isactive', S.boolean().required())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', user)
  .prop('roomid', S.number().required())
  .prop('name', S.string().required())
  .prop('description', S.string())
  .prop('secret', S.string())
  .prop('bitrate', S.number().required())
  .prop('fir_freq', S.number().required())
  .prop('audiocodec', S.string().required())
  .prop('videocodec', S.string().required())
  .prop('record', S.boolean().required())
  .prop('rec_dir', S.string())
  .prop('moderators', S.array().items(user))
  .prop('members', S.array().items(user))
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const roomUpdate = S.object()
  .prop('owner', S.string())
  .prop('roomid', S.number())
  .prop('name', S.string())
  .prop('description', S.string())
  .prop('secret', S.string())
  .prop('bitrate', S.number())
  .prop('fir_freq', S.number())
  .prop('audiocodec', S.string())
  .prop('videocodec', S.string())
  .prop('record', S.boolean())
  .prop('rec_dir', S.string())

const updateBody = S.object()
  .prop('id', S.string().required())
  .prop('update', roomUpdate)

const userids = S.array().items(S.string())
const arrayOps = S.object()
  .prop('id', S.string().required())
  .prop('users', userids)
  .prop('user', S.string())

const roomList = S.array().items(room)

const deleteParams = S.object()
  .prop('id', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

module.exports = {
  get: {
    querystring: getQueryString,
    response: {
      200: room
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: roomList
    }
  },
  create: {
    body: room,
    response: {
      200: room
    }
  },
  update: {
    body: updateBody,
    response: {
      200: room
    }
  },
  delete: {
    params: deleteParams,
    response: {
      200: delete200
    }
  },
  members: {
    push: {
      body: arrayOps,
      response: {
        200: room
      }
    },
    update: {
      body: updateBody,
      response: {
        200: room
      }
    },
    pull: {
      body: arrayOps,
      response: {
        200: room
      }
    }
  },
  moderators: {
    push: {
      body: arrayOps,
      response: {
        200: room
      }
    },
    update: {
      body: updateBody,
      response: {
        200: room
      }
    },
    pull: {
      body: arrayOps,
      response: {
        200: room
      }
    }
  }
}
