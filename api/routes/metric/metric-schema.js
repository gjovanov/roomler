const S = require('fluent-schema')

const userConnection = S.object()
  .prop('_id', S.string().required())
  .prop('conn_id', S.string().required())
  .prop('process_name', S.string().required())
  .prop('status', S.string().required())
  .prop('ip_address', S.string().required())
  .prop('country_code', S.string())
  .prop('country_name', S.string())
  .prop('user', S.string())

const userConnectionList = S.array().items(userConnection)

const wsUserConnection = S.object()
  .prop('op')
  .prop('data', userConnectionList)

module.exports = {
  wsUserConnection
}
