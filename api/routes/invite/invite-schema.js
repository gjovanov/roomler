const S = require('fluent-schema')
const config = require('../../../config')
const types = config.dataSettings.invite.types
const statuses = config.dataSettings.invite.statuses

const getQueryString = S.object()
  .prop('id', S.string().required())

const getAllQueryString = S.object()
  .prop('room', S.string().required())
  .prop('page', S.integer())
  .prop('size', S.integer())

const room = S.object()
  .prop('_id', S.string())
  .prop('owner', S.string())
  .prop('name', S.string())
  .prop('path', S.string())
  .prop('emoji', S.string())
  .prop('is_open', S.boolean())
  .prop('moderators', S.array().items(S.string()))
  .prop('members', S.array().items(S.string()))

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())
  .prop('avatar_url', S.string())
  .prop('role', S.string())
  .prop('connections', S.array().items(S.string()))

const invite = S.object()
  .prop('_id', S.string())
  .prop('inviter', user)
  .prop('room', room.required())
  .prop('name', S.string())
  .prop('email', S.string())
  .prop('type', S.string())
  .prop('status', S.string().enum(statuses))
  .prop('invitee', user)
  .prop('createdAt', S.string())
  .prop('updatedAt', S.string())

const inviteList = S.array().items(invite)

const createBody = S.object()
  .prop('room', S.string().required())
  .prop('name', S.string().required())
  .prop('email', S.string().required())
  .prop('type', S.string().enum(types))
const createBodyItems = S.array().items(createBody)

const inviteUpdate = S.object()
  .prop('name', S.string())
  .prop('email', S.string())
  .prop('type', S.string().enum(types))

const idParam = S.object()
  .prop('id', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

const wsInvite = S.object()
  .prop('op')
  .prop('data', inviteList)
module.exports = {
  wsInvite,
  get: {
    querystring: getQueryString,
    response: {
      200: invite
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: inviteList
    }
  },
  create: {
    body: createBodyItems,
    response: {
      200: inviteList
    }
  },
  update: {
    params: idParam,
    body: inviteUpdate,
    response: {
      200: invite
    }
  },
  accept: {
    params: idParam,
    response: {
      200: invite
    }
  },
  reject: {
    params: idParam,
    response: {
      200: invite
    }
  },
  delete: {
    params: idParam,
    response: {
      200: delete200
    }
  }
}
