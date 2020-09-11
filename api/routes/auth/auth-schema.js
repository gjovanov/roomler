const S = require('fluent-schema')
const config = require('../../../config')
const codeTypes = config.dataSettings.code.types

const usernameParam = S.object()
  .prop('query', S.string().required())

const ids = S.object()
  .prop('ids', S.array().items(S.string()))

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

const registerBody = S.object()
  .prop('email', S.string().minLength(5).maxLength(255).required())
  .prop('username', S.string().minLength(8).maxLength(50).required())
  .prop('password', S.string().minLength(8).required())
  .prop('passwordConfirm', S.string().minLength(8).required())
  .prop('oauthId', S.string())

const avatarInput = S.object()
  .prop('avatar_url', S.string().required())

const userToken = S.object()
  .prop('user', user)
  .prop('token', S.string())
  .prop('is_admin', S.boolean())
  .prop('timestamp', S.number())

const activateBody = S.object()
  .prop('username', S.string().minLength(8).required())
  .prop('token', S.string().required())

const loginBody = S.object()
  .prop('username', S.string().minLength(8).required())
  .prop('password', S.string().minLength(8).required())

const resetBody = S.object()
  .prop('email', S.string().required())
  .prop('type', S.string().enum(codeTypes).required())

const resultOk = S.object()
  .prop('result', S.string().required())

const usernameUpdateBody = S.object()
  .prop('email', S.string().required())
  .prop('token', S.string().required())
  .prop('username', S.string().required())

const passwordUpdateBody = S.object()
  .prop('email', S.string().required())
  .prop('token', S.string().required())
  .prop('password', S.string().required())
  .prop('passwordConfirm', S.string().required())

const delete200 = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

const connection = S.object()
  .prop('_id', S.string().required())
  .prop('conn_id', S.string().required())
  .prop('status', S.string().required())
  .prop('ip_address', S.string().required())
  .prop('country_code', S.string())
  .prop('country_name', S.string())
  .prop('user', S.string())

const connectionList = S.array().items(connection)

const wsConnection = S.object()
  .prop('op')
  .prop('data', connectionList)

module.exports = {
  wsConnection,
  register: {
    body: registerBody,
    response: {
      200: userToken
    }
  },
  activate: {
    body: activateBody,
    response: {
      200: userToken
    }
  },
  login: {
    body: loginBody,
    response: {
      200: userToken
    }
  },
  logout: {
    response: {
      200: resultOk
    }
  },
  reset: {
    body: resetBody,
    response: {
      200: resultOk
    }
  },
  update: {
    avatar: {
      body: avatarInput,
      response: {
        200: userToken
      }
    },
    username: {
      body: usernameUpdateBody,
      response: {
        200: userToken
      }
    },
    password: {
      body: passwordUpdateBody,
      response: {
        200: userToken
      }
    }
  },
  me: {
    response: {
      200: userToken
    }
  },
  get: {
    params: usernameParam,
    response: {
      200: user
    }
  },
  getAll: {
    body: ids,
    response: {
      200: userList
    }
  },
  getPeers: {
    response: {
      200: userList
    }
  },
  delete: {
    response: {
      200: delete200
    }
  }
}
