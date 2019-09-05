import test from 'ava'
const fastify = require('../../../api/api')()
const pingOps = require('../.common/ping-ops')

pingOps.ping(fastify, test, 'ping returns { result: pong }')

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
