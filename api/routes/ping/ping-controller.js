class PingController {
  doPing (request, reply) {
    reply.send({
      result: 'pong'
    })
  }
}

module.exports = new PingController()
