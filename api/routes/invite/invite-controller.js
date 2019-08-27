const inviteService = require('../../services/invite/invite-service')

class InviteController {
  async get (request, reply) {
    const result = await inviteService.get(request.user.user._id, request.query.id)
    reply.send(result)
  }

  async getAll (request, reply) {
    const filter = request.query.roomid ? {
      room: request.query.roomid
    } : {}
    const result = await inviteService.getAll(request.user.user._id, request.query.page || 0, request.query.size || 10, filter)
    reply.send(result)
  }

  async create (request, reply) {
    const payload = request.body
    const result = await inviteService.create(request.user.user, payload)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const update = {
      $set: payload.update
    }
    const result = await inviteService.update(request.user.user._id, payload.id, update)
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await inviteService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }

  async accept (request, reply) {
    const result = await inviteService.accept(request.user.user._id, request.params.id)
    reply.send(result)
  }

  async reject (request, reply) {
    const result = await inviteService.reject(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new InviteController()
