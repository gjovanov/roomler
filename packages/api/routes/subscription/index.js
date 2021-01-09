const errorSchema = require('../.common/error-schema')
const subscriptionController = require('./subscription-controller')
const subscriptionSchema = require('./subscription-schema')

module.exports = [{
  authenticate: true,
  method: 'POST',
  url: '/api/subscription/create',
  schema: {
    body: subscriptionSchema.create.body,
    response: {
      200: subscriptionSchema.create.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: subscriptionController.create
}, {
  authenticate: true,
  method: 'PUT',
  url: '/api/subscription/delete',
  schema: {
    body: subscriptionSchema.delete.body,
    response: {
      200: subscriptionSchema.delete.response[200],
      409: errorSchema.response[409],
      500: errorSchema.response[500]
    }
  },
  handler: subscriptionController.delete
}]
