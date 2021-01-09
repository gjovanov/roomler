class PingController {
  ping (request, reply) {
    reply.send({
      result: 'pong'
    })
  }
}

module.exports = new PingController()
