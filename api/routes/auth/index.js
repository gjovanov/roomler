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
  url: '/api/auth/code/get',
  schema: {
    body: authSchema.code.get.body,
    response: {
      200: authSchema.code.get.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.getCode
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
  method: 'PUT',
  url: '/api/auth/password/update',
  schema: {
    body: authSchema.password.update.body,
    response: {
      200: authSchema.password.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.updatePassword
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/auth/person/update',
  schema: {
    body: authSchema.person.update.body,
    response: {
      200: authSchema.person.update.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: authController.updatePerson
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
