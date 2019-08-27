const S = require('fluent-schema')

const error409 = S.object()
  .prop('errors', S.array().items(
    S.object()
    .prop('prop', S.string().required())
    .prop('message', S.string().required())
  ))

const error500 = S.object()
  .prop('name', S.string())
  .prop('message', S.string())

module.exports = {
  response: {
    409: error409,
    500: error500
  }
}
