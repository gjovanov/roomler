const roomService = require('../../services/room/room-service')

class RoomController {
  async get (request, reply) {
    const result = await roomService.get(request.user.user._id, request.query.id)
    reply.send(result)
  }

  async getAll (request, reply) {
    const result = await roomService.getAll(request.user.user._id, request.query.page, request.query.size)
    reply.send(result)
  }

  async create (request, reply) {
    const payload = request.body
    const result = await roomService.create(request.user.user._id, payload)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    const result = await roomService.update(request.user.user._id, id, update)
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await roomService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new RoomController()
