(async function () {
  try {
    const consola = require('consola')
    consola.info('Starting Fastify server for DB cleanup...')
    const fastify = require('fastify')({
      logger: false
    })
      .register(
        require('../api/plugins/mongoose/fastify-mongoose'),
        require('../api/plugins/mongoose/mongoose-options'))
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
