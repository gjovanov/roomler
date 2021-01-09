const S = require('fluent-schema')

const keys = S.object()
  .prop('auth', S.string())
  .prop('p256dh', S.string())
const subscription = S.object()
  .prop('endpoint', S.string())
  .prop('expirationTime', S.string())
  .prop('keys', keys)

const deleteResult = S.object()
  .prop('n', S.number().required())
  .prop('ok', S.number().required())
  .prop('deletedCount', S.number().required())

module.exports = {
  create: {
    body: subscription,
    response: {
      200: subscription
    }
  },
  delete: {
    body: subscription,
    response: {
      200: deleteResult
    }
  }
}
