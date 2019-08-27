const fastify = require('../api/api')()
const run = async function () {
  console.log('Starting Fastify server for DB cleanup...')
  await fastify.ready()
  console.log('Dropping DB...')
  await fastify.mongo.db.dropDatabase()
  console.log('Stopping Fastify server for DB cleanup...')
  await fastify.close()
}

run()
