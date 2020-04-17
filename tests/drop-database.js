(async function () {
  try {
    const consola = require('consola')
    const fastify = require('../api/api')()
    consola.info('Starting Fastify server for DB cleanup...')
    await fastify.ready()
    consola.info('Dropping DB...')
    await fastify.mongo.db.dropDatabase()
    consola.info('Stopping Fastify server for DB cleanup...')
    await fastify.close()
    consola.success('DB dropped and fastify stopped.')
  } catch (e) {
    console.error(e)
  }
})()
