import test from 'ava'
const fastify = require('../../../api/api')()

test.serial('API "/api/ping" returns { result: "pong" }', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/ping`
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      t.deepEqual(JSON.parse(response.payload), {
        result: 'pong'
      })
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})
test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
