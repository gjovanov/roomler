const S = require('fluent-schema')
const messageList = require('../message/message-schema').getAll.response['200']

const getQueryString = S.object()
  .prop('id', S.string())
  .prop('query', S.string())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('search', S.string())

const getReportsQueryString = S.object()
  .prop('from', S.string())
  .prop('to', S.string())
  .prop('status', S.string())
  .prop('room', S.string())
  .prop('user', S.string())
  .prop('os', S.string())
  .prop('browser', S.string())
  .prop('country', S.string())
  .prop('device', S.string())
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('sortBy', S.string())
  .prop('sortDesc', S.string())

const deleteResult = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

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
  .prop('notify_joining', S.boolean())
  .prop('use_sip_bridge', S.boolean())

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())
  .prop('is_username_set', S.boolean().required())
  .prop('is_password_set', S.boolean().required())
  .prop('avatar_url', S.string())
  .prop('connections', S.array().items(S.string()))

const userList = S.array().items(user)

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', S.string())
  .prop('name', S.string().required())
  .prop('parent_id', S.string())
  .prop('path', S.string())
  .prop('is_open', S.boolean())
  .prop('tags', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('media', media)
  .prop('moderators', S.array().items(S.string()))
  .prop('members', S.array().items(S.string()))
  .prop('calls', S.array().items(S.string()))
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const continent = S.object()
  .prop('code', S.string())
  .prop('name', S.string())

const country = S.object()
  .prop('code', S.string())
  .prop('name', S.string())
  .prop('is_eu', S.boolean())

const geoip = S.object()
  .prop('continent', continent)
  .prop('country', country)
  .prop('city_name', S.string())
const os = S.object()
  .prop('name', S.string())
  .prop('version', S.string())

const browser = S.object()
  .prop('name', S.string())
  .prop('version', S.string())
  .prop('is_mobile', S.boolean())

const call = S.object()
  .prop('_id', S.string())
  .prop('call_id', S.string())
  .prop('user', S.string())
  .prop('room', S.string())
  .prop('status', S.string())
  .prop('id_address', S.string())
  .prop('geoip', geoip)

const callFull = S.object()
  .prop('_id', S.string())
  .prop('call_id', S.string())
  .prop('user', S.string())
  .prop('room', S.string())
  .prop('status', S.string())
  .prop('id_address', S.string())
  .prop('geoip', geoip)
  .prop('user', user)
  .prop('device_id', S.string())
  .prop('os', os)
  .prop('browser', browser)
  .prop('duration', S.integer())
  .prop('createdAt', S.string())
const callFullList = S.array().items(callFull)

const roomCall = S.object()
  .prop('room', room)
  .prop('call', call)
const roomCallList = S.array().items(roomCall)
const callList = S.array().items(call)

const aggregateId = S.object()
  .prop('year', S.integer())
  .prop('month', S.integer())
  .prop('week', S.integer())
  .prop('day', S.integer())
  .prop('key', S.string())

const aggregate = S.object()
  .prop('_id', aggregateId)
  .prop('count', S.integer())
  .prop('duration', S.integer())
const aggregateList = S.array().items(aggregate)

const pagedRoomCallList = S.object()
  .prop('data', callFullList)
  .prop('count', S.integer())
  .prop('rooms', aggregateList)
  .prop('countries', aggregateList)
  .prop('users', aggregateList)
  .prop('os', aggregateList)
  .prop('browsers', aggregateList)
  .prop('pages', aggregateList)
  .prop('refs', aggregateList)

const roomList = S.array().items(room)
const roomMessage = S.object()
  .prop('roomid', S.string())
  .prop('messages', messageList)

const messages = S.array().items(roomMessage)
const getAllResponse = S.object()
  .prop('peers', userList)
  .prop('rooms', roomList)
  .prop('messages', messages)
  .prop('calls', callList)

const pagedRoomList = S.object()
  .prop('data', roomList)
  .prop('count', S.integer())

const roomUsers = S.object()
  .prop('room', room)
  .prop('users', userList)

const roomUpdate = S.object()
  .prop('owner', S.string())
  .prop('name', S.string())
  .prop('is_open', S.boolean())
  .prop('tags', S.array().items(S.string()))
  .prop('description', S.string())
  .prop('media', media)

const roomUpdateResult = S.object()
  .prop('room', room)
  .prop('children', roomList)

const roomDeleteResult = S.object()
  .prop('room', room)
  .prop('children', roomList)
  .prop('result', deleteResult)

const userids = S.array().items(S.string())
const arrayOps = S.object()
  .prop('users', userids)
  .prop('user', S.string())

const idParams = S.object()
  .prop('id', S.string().required())

const wsRoomUsers = S.object()
  .prop('op')
  .prop('data', S.array().items(roomUsers))

const wsRoomCreate = S.object()
  .prop('op')
  .prop('data', roomList)

const wsRoomUpdate = S.object()
  .prop('op')
  .prop('data', S.array().items(roomUpdateResult))

const wsRoomDelete = S.object()
  .prop('op')
  .prop('data', S.array().items(roomDeleteResult))

const wsRoomCall = S.object()
  .prop('op')
  .prop('data', roomCallList)

const roomCallPullResult = S.object()
  .prop('ok', S.boolean())

module.exports = {
  wsRoomUsers,
  wsRoomCreate,
  wsRoomUpdate,
  wsRoomDelete,
  wsRoomCall,
  get: {
    querystring: getQueryString,
    response: {
      200: room
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: getAllResponse
    }
  },
  explore: {
    querystring: getAllQueryString,
    response: {
      200: pagedRoomList
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
      200: roomUpdateResult
    }
  },
  delete: {
    params: idParams,
    response: {
      200: roomDeleteResult
    }
  },
  owner: {
    transfer: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    }
  },
  members: {
    switch: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    },
    push: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    },
    update: {
      params: idParams,
      body: roomUpdate,
      response: {
        200: roomUsers
      }
    },
    pull: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    }
  },
  moderators: {
    switch: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    },
    push: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    },
    update: {
      params: idParams,
      body: roomUpdate,
      response: {
        200: roomUsers
      }
    },
    pull: {
      params: idParams,
      body: arrayOps,
      response: {
        200: roomUsers
      }
    }
  },
  calls: {
    getAll: {
      response: {
        200: callList
      }
    },
    getReports: {
      querystring: getReportsQueryString,
      response: {
        200: pagedRoomCallList
      }
    },
    pull: {
      params: idParams,
      response: {
        200: roomCallPullResult
      }
    }
  }
}
