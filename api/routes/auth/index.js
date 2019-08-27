const errorSchemas = require('../.common/error-schemas')
const authController = require('./auth-controller')
const authSchemas = require('./auth-schemas')

module.exports = [{
  method: 'POST',
  url: '/api/auth/register',
  schema: {
    body: authSchemas.register.body,
    response: {
      200: authSchemas.register.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.register
},
{
  method: 'POST',
  url: '/api/auth/code/get',
  schema: {
    body: authSchemas.code.get.body,
    response: {
      200: authSchemas.code.get.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.getCode
},
{
  method: 'POST',
  url: '/api/auth/activate',
  schema: {
    body: authSchemas.activate.body,
    response: {
      200: authSchemas.register.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.activate
},
{
  method: 'POST',
  url: '/api/auth/login',
  schema: {
    body: authSchemas.login.body,
    response: {
      200: authSchemas.login.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.login
},
{
  method: 'PUT',
  url: '/api/auth/password/update',
  schema: {
    body: authSchemas.password.update.body,
    response: {
      200: authSchemas.password.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.updatePassword
},
{
  authenticate: true,
  method: 'PUT',
  url: '/api/auth/person/update',
  schema: {
    body: authSchemas.person.update.body,
    response: {
      200: authSchemas.person.update.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
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
      200: authSchemas.me.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
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
      200: authSchemas.delete.response[200],
      409: errorSchemas.response[409],
      500: errorSchemas.response[500]
    }
  },
  handler: authController.delete
}
]
