const consola = require('consola')

class ApiServer {
  constructor () {
    this.fastify = require('../../api/api')()
  }

  async up (port = process.env.PORT || 3001, host = process.env.HOST || 'localhost') {
    try {
      const address = await this.fastify.listen(port, host)
      this.fastify.swagger()
      consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
    } catch (err) {
      consola.error(err)
      process.exit(1)
    }
    return this.fastify
  }

  async down () {
    await this.fastify.close()
  }
}

module.exports = new ApiServer()
