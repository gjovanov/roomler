const config = require('roomler.config')

class ConfigController {
  get (request, reply) {
    reply.send(config)
  }
}

module.exports = new ConfigController()
