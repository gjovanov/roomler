const emailService = require('../../services/email/email-service')

class EmailController {
  async get (request, reply) {
    const result = await emailService.get(request.user.user._id, request.query.id)
    reply.send(result)
  }

  async getAll (request, reply) {
    const result = await emailService.getAll(request.user.user._id, request.query.page, request.query.size)
    reply.send(result)
  }

  async send (request, reply) {
    const payload = request.body
    const result = await emailService.send(request.user.user._id, payload)
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await emailService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new EmailController()
