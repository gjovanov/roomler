const roomService = require('../../services/room/room-service')

class RoomMembersController {
  async push (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.push(request.user.user._id, id, 'members', payload)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.updateList(request.user.user._id, id, 'members', payload)
    reply.send(result)
  }

  async pull (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.pull(request.user.user._id, id, 'members', payload)
    reply.send(result)
  }
}

module.exports = new RoomMembersController()
