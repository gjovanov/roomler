const waitABit = (duration = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 300)
  })
}
(async function () {
  try {
    const consola = require('consola')
    consola.info('Starting Fastify server for DB cleanup...')
    const fastify = await require('fastify')({
      logger: false
    })
      .register(
        require('roomler.api/plugins/mongoose/fastify-mongoose'),
        require('roomler.api/plugins/mongoose/mongoose-options'))
    await fastify.ready()
    consola.info('Dropping DB...')
    await fastify.mongo.db.dropDatabase()
    consola.info('Stopping Fastify server for DB cleanup...')
    await fastify.close()
    await waitABit()
    consola.success('DB dropped and fastify stopped.')
  } catch (e) {
    console.error(e)
  }
})()
