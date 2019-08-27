const S = require('fluent-schema')

const response = S.object()
  .prop('result', S.string().required())

module.exports = {
  ping: {
    response: {
      200: response
    }
  }
}
