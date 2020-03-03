const S = require('fluent-schema')

const connection = S.object()
  .prop('_id', S.string().required())
  .prop('conn_id', S.string().required())
  .prop('process_name', S.string().required())
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
  wsConnection
}
