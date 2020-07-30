const S = require('fluent-schema')

const callbackQueryString = S.object()
  .prop('type', S.string().required())
  .prop('code', S.string().required())
  .prop('state', S.string().required())

const getAllQueryString = S.object()
  .prop('page', S.integer())
  .prop('size', S.integer())

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())
  .prop('is_username_set', S.boolean().required())
  .prop('is_password_set', S.boolean().required())
  .prop('avatar_url', S.string())
  .prop('connections', S.array().items(S.string()))

const oauth = S.object()
  .prop('_id', S.string().required())
  .prop('type', S.string().required())
  .prop('email', S.string().required())
  .prop('id', S.string())
  .prop('name', S.string())
  .prop('avatar_url', S.string())

const updateBody = S.object()
  .prop('type', S.string())
  .prop('email', S.string())
  .prop('id', S.string())
  .prop('name', S.string())
  .prop('avatar_url', S.string())

const oauthList = S.array().items(oauth)

const oauthUserToken = S.object()
  .prop('oauth', oauth)
  .prop('user', user)
  .prop('token', S.string())
  .prop('is_admin', S.boolean())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

const idParams = S.object()
  .prop('id', S.string().required())

module.exports = {
  getOrCreate: {
    querystring: callbackQueryString,
    response: {
      200: oauthUserToken
    }
  },
  getAll: {
    querystring: getAllQueryString,
    response: {
      200: oauthList
    }
  },
  update: {
    body: updateBody,
    response: {
      200: oauth
    }
  },
  delete: {
    response: {
      200: delete200
    }
  },
  link: {
    params: idParams,
    response: {
      200: oauth
    }
  }
}
