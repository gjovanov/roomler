const messageService = require('../../services/message/message-service')

class MessageReadbyController {
  async push (request, reply) {
    const id = request.params.id
    const result = await messageService.pushReadby(request.user.user._id, id)
    reply.send(result)
  }

  async pushAll (request, reply) {
    const ids = request.body
    const result = await messageService.pushAllReadby(request.user.user._id, ids)
    reply.send(result)
  }

  async pull (request, reply) {
    const id = request.params.id
    const result = await messageService.pullReadby(request.user.user._id, id)
    reply.send(result)
  }
}

module.exports = new MessageReadbyController()
