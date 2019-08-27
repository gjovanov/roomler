const fastify = require('./api')()
// const dbConnect = require('./db/connect')

class ApiServer {
  constructor () {
    this.fastify = null
  }

  async up (port = process.env.PORT || 3001, host = process.env.HOST || '127.0.0.1') {
    this.host = host
    this.port = port
    try {
      // await dbConnect()
      const address = await fastify.listen(port, host)
      fastify.swagger()
      this.fastify = fastify
      console.log(`SERVER is listening at: ${address}`)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    return fastify
  }

  async down () {
    await this.fastify.close()
  }
}

module.exports = new ApiServer()
