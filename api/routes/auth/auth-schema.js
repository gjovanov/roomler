const S = require('fluent-schema')
const config = require('../../../config')
const codeTypes = config.dataSettings.code.types

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())
  .prop('is_username_set', S.boolean().required())
  .prop('is_password_set', S.boolean().required())

const registerBody = S.object()
  .prop('email', S.string().minLength(5).maxLength(255).required())
  .prop('username', S.string().minLength(8).maxLength(50).required())
  .prop('password', S.string().minLength(8).required())
  .prop('passwordConfirm', S.string().minLength(8).required())
  .prop('oauthId', S.string())

const personInput = S.object()
  .prop('firstname', S.string().required())
  .prop('lastname', S.string().required())
  .prop('photoUrl', S.string().required())

const personOutput = S.object()
  .prop('firstname', S.string())
  .prop('lastname', S.string)
  .prop('photoUrl', S.string())

const userTokenPerson = S.object()
  .prop('user', user)
  .prop('token', S.string())
  .prop('person', personOutput)

const activateBody = S.object()
  .prop('username', S.string().minLength(8).required())
  .prop('token', S.string().required())
  .prop('inviteid', S.string())

const loginBody = S.object()
  .prop('username', S.string().minLength(8).required())
  .prop('password', S.string().minLength(8).required())

const codeGetBody = S.object()
  .prop('username', S.string().required())
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

module.exports = {
  register: {
    body: registerBody,
    response: {
      200: userTokenPerson
    }
  },
  activate: {
    body: activateBody,
    response: {
      200: userTokenPerson
    }
  },
  login: {
    body: loginBody,
    response: {
      200: userTokenPerson
    }
  },
  reset: {
    body: codeGetBody,
    response: {
      200: resultOk
    }
  },
  update: {
    person: {
      body: personInput,
      response: {
        200: personOutput
      }
    },
    username: {
      body: usernameUpdateBody,
      response: {
        200: userTokenPerson
      }
    },
    password: {
      body: passwordUpdateBody,
      response: {
        200: userTokenPerson
      }
    }
  },
  me: {
    response: {
      200: userTokenPerson
    }
  },
  delete: {
    response: {
      200: delete200
    }
  }
}
