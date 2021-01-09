const subscriptionService = require('../../services/subscription/subscription-service')

class SubscriptionController {
  async create (request, reply) {
    const payload = request.body
    const result = await subscriptionService.create(request.user.user._id, payload)
    reply.send(result)
  }

  async delete (request, reply) {
    const payload = request.body
    const result = await subscriptionService.delete(request.user.user._id, payload)
    reply.send(result)
  }
}

module.exports = new SubscriptionController()
