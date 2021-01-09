const inviteService = require('../../services/invite/invite-service')
const config = require('roomler.config')
const wsDispatcher = require('../ws/ws-dispatcher')

class InviteController {
  async get (request, reply) {
    const result = await inviteService.get(request.user.user._id, request.query.id)
    reply.send(result)
  }

  async getAll (request, reply) {
    const filter = {
      room: request.query.room
    }
    const result = await inviteService.getAll(request.user.user._id, request.query.page, request.query.size, filter)
    reply.send(result)
  }

  async create (request, reply) {
    const payload = request.body
    const result = await inviteService.create(request.user.user, payload)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    const result = await inviteService.update(request.user.user._id, id, update)
    wsDispatcher.publish(config.wsSettings.opTypes.roomInviteUpdate, [result])
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await inviteService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }

  async accept (request, reply) {
    const result = await inviteService.accept(request.user.user._id, request.params.id)
    wsDispatcher.publish(config.wsSettings.opTypes.roomInviteAccept, [result])
    reply.send(result)
  }

  async reject (request, reply) {
    const result = await inviteService.reject(request.user.user._id, request.params.id)
    wsDispatcher.publish(config.wsSettings.opTypes.roomInviteReject, [result])
    reply.send(result)
  }
}

module.exports = new InviteController()
