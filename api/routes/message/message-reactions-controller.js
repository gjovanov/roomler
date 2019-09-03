const messageService = require('../../services/message/message-service')

class MessageReactionsController {
  async push (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await messageService.pushReaction(request.user.user._id, id, payload)
    reply.send(result)
  }

  async pull (request, reply) {
    const id = request.params.id
    const result = await messageService.pullReaction(request.user.user._id, id)
    reply.send(result)
  }
}

module.exports = new MessageReactionsController()
