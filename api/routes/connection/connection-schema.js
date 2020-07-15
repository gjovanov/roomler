const S = require('fluent-schema')

const continent = S.object()
  .prop('code', S.string())
  .prop('name', S.string())

const country = S.object()
  .prop('code', S.string())
  .prop('name', S.string())
  .prop('is_eu', S.boolean())

const geoip = S.object()
  .prop('continent', continent)
  .prop('country', country)
  .prop('city_name', S.string())

const connection = S.object()
  .prop('_id', S.string().required())
  .prop('conn_id', S.string().required())
  .prop('status', S.string().required())
  .prop('ip_address', S.string().required())
  .prop('user', S.string())
  .prop('geoip', geoip)

const connectionList = S.array().items(connection)

const wsConnection = S.object()
  .prop('op')
  .prop('data', connectionList)

module.exports = {
  wsConnection
}
