const errorSchema = require('../.common/error-schema')
const authController = require('./auth-controller')
const authSchema = require('./auth-schema')

module.exports = [{
  method: 'POST',
  url: '/api/auth/register',
  schema: {
    body: authSchema.register.body,
    response: {
      200: authSchema.register.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.register
},
{
  method: 'POST',
  url: '/api/auth/reset',
  schema: {
    body: authSchema.reset.body,
    response: {
      200: authSchema.reset.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.reset
},
{
  method: 'POST',
  url: '/api/auth/activate',
  schema: {
    body: authSchema.activate.body,
    response: {
      200: authSchema.register.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.activate
},
{
  method: 'POST',
  url: '/api/auth/login',
  schema: {
    body: authSchema.login.body,
    response: {
      200: authSchema.login.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.login
},
{
  method: 'POST',
  url: '/api/auth/logout',
  schema: {
    response: {
      200: authSchema.logout.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.logout
},
{
  method: 'PUT',
  url: '/api/auth/update/username',
  schema: {
    body: authSchema.update.username.body,
    response: {
      200: authSchema.update.username.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.updateUsername
},
{
  method: 'PUT',
  url: '/api/auth/update/password',
  schema: {
    body: authSchema.update.password.body,
    response: {
      200: authSchema.update.password.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.updatePassword
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/auth/update/avatar',
  schema: {
    body: authSchema.update.avatar.body,
    response: {
      200: authSchema.update.avatar.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.updateAvatar
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/auth/me',
  schema: {
    response: {
      200: authSchema.me.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.me
},
{
  authenticate: true,
  method: 'GET',
  url: '/api/auth/get-peers',
  schema: {
    response: {
      200: authSchema.getPeers.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.getPeers
},
{
  method: 'GET',
  url: '/api/auth/get/:query',
  schema: {
    params: authSchema.get.params,
    response: {
      200: authSchema.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.get
},
{
  method: 'POST',
  url: '/api/auth/getAll',
  schema: {
    body: authSchema.getAll.body,
    response: {
      200: authSchema.getAll.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.getAll
},
{
  authenticate: true,
  method: 'DELETE',
  url: '/api/auth/delete',
  schema: {
    response: {
      200: authSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.delete
}
]
