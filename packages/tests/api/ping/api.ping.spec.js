const test = require('ava')
let fastify = null
const pingOps = require('../.common/ping-ops')

const run = async () => {
  fastify = await require('roomler.api')()

  pingOps.ping(fastify, test, 'ping returns { result: pong }')

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}

run()
