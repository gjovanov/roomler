const messageService = require('../../services/message/message-service')

class MessageReactionsController {
  async push (request, reply) {
    const payload = request.body
    const result = await messageService.push(request.user.user._id, payload)
    reply.send(result)
  }

  async pull (request, reply) {
    const payload = request.body
    const result = await messageService.pull(request.user.user._id, payload)
    reply.send(result)
  }
}

module.exports = new MessageReactionsController()
