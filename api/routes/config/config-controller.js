const config = require('../../../config')

class ConfigController {
  get (request, reply) {
    reply.send(config)
  }
}

module.exports = new ConfigController()
