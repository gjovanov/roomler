const S = require('fluent-schema')

const getAllQueryString = S.object()
  .prop('from', S.string())
  .prop('to', S.string())
  .prop('type', S.string())
  .prop('status', S.string())
  .prop('room', S.string())
  .prop('user', S.string())
  .prop('os', S.string())
  .prop('browser', S.string())
  .prop('country', S.string())
  .prop('device', S.string())
  .prop('url', S.string())
  .prop('referrer', S.string())
  .prop('page', S.integer())
  .prop('size', S.integer())
  .prop('sortBy', S.string())
  .prop('sortDesc', S.string())

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

const user = S.object()
  .prop('_id', S.string().required())
  .prop('username', S.string().required())
  .prop('email', S.string().required())
  .prop('is_active', S.boolean().required())
  .prop('avatar_url', S.string())

const os = S.object()
  .prop('name', S.string())
  .prop('version', S.string())

const browser = S.object()
  .prop('name', S.string())
  .prop('version', S.string())
  .prop('is_mobile', S.boolean())

const connection = S.object()
  .prop('_id', S.string())
  .prop('conn_id', S.string())
  .prop('status', S.string())
  .prop('ip_address', S.string())
  .prop('user', S.string())
  .prop('geoip', geoip)
  .prop('user', user)
  .prop('device_id', S.string())
  .prop('os', os)
  .prop('browser', browser)

const visit = S.object()
  .prop('_id', S.string())
  .prop('connection', connection)
  .prop('url', S.string())
  .prop('page', S.string())
  .prop('referrer', S.string())
  .prop('ref', S.string())
  .prop('status', S.string())
  .prop('duration', S.integer())
  .prop('createdAt', S.string())

const aggregateId = S.object()
  .prop('year', S.integer())
  .prop('month', S.integer())
  .prop('week', S.integer())
  .prop('day', S.integer())
  .prop('key', S.string())

const aggregate = S.object()
  .prop('_id', aggregateId)
  .prop('count', S.integer())
  .prop('duration', S.integer())
const aggregateList = S.array().items(aggregate)

const visitList = S.array().items(visit)
const pagedVisitList = S.object()
  .prop('data', visitList)
  .prop('count', S.integer())
  .prop('countries', aggregateList)
  .prop('users', aggregateList)
  .prop('os', aggregateList)
  .prop('browsers', aggregateList)
  .prop('pages', aggregateList)
  .prop('refs', aggregateList)

const wsVisit = S.object()
  .prop('op')
  .prop('data', visitList)

module.exports = {
  wsVisit,

  getStats: {
    querystring: getAllQueryString,
    response: {
      200: pagedVisitList
    }
  }
}
