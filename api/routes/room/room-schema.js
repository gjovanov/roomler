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
  .prop('is_active', S.boolean().required())
  .prop('avatar_url', S.string())
  .prop('role', S.string())

const media = S.object()
  .prop('roomid', S.number())
  .prop('publishers', S.number())
  .prop('secret', S.string())
  .prop('pin', S.string())
  .prop('bitrate', S.number())
  .prop('fir_freq', S.number())
  .prop('audiocodec', S.string())
  .prop('videocodec', S.string())
  .prop('record', S.boolean())
  .prop('rec_dir', S.string())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', user)
  .prop('name', S.string().required())
  .prop('path', S.string())
  .prop('is_open', S.boolean())
  .prop('tags', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('media', media)
  .prop('moderators', S.array().items(user))
  .prop('members', S.array().items(user))
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const roomUpdate = S.object()
  .prop('owner', S.string())
  .prop('name', S.string())
  .prop('is_open', S.boolean())
  .prop('tags', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('media', media)

const userids = S.array().items(S.string())
const arrayOps = S.object()
  .prop('users', userids)
  .prop('user', S.string())

const roomList = S.array().items(room)

const idParams = S.object()
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
    params: idParams,
    body: roomUpdate,
    response: {
      200: room
    }
  },
  delete: {
    params: idParams,
    response: {
      200: delete200
    }
  },
  members: {
    push: {
      params: idParams,
      body: arrayOps,
      response: {
        200: room
      }
    },
    update: {
      params: idParams,
      body: roomUpdate,
      response: {
        200: room
      }
    },
    pull: {
      params: idParams,
      body: arrayOps,
      response: {
        200: room
      }
    }
  },
  moderators: {
    push: {
      params: idParams,
      body: arrayOps,
      response: {
        200: room
      }
    },
    update: {
      params: idParams,
      body: roomUpdate,
      response: {
        200: room
      }
    },
    pull: {
      params: idParams,
      body: arrayOps,
      response: {
        200: room
      }
    }
  }
}
