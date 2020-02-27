const roomService = require('../../services/room/room-service')
const config = require('../../../config')
const wsDispatcher = require('../ws/ws-dispatcher')

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
    let parentRoom = null
    if (payload.parent_id) {
      parentRoom = await roomService.get(request.user.user._id, payload.parent_id, ['owner', 'moderators'])
    }
    roomService.slugify(payload, parentRoom)
    const result = await roomService.create(request.user.user._id, payload)
    const parents = await roomService.getParents(result)
    const messages = [result, ...parents]
    wsDispatcher.dispatch(config.wsSettings.opTypes.roomCreate, messages, true)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    let result
    let children = []
    if (!payload.name) {
      result = await roomService.update(request.user.user._id, id, update)
    } else {
      // slugify using parent's name and rename the children
      const room = await roomService.get(request.user.user._id, id)
      const parentRoom = await roomService.getParent(room)
      roomService.slugify(payload, parentRoom)
      result = await roomService.update(request.user.user._id, id, update)
      await roomService.renameChildren(room.name, payload.name)
      children = await roomService.getChildren(result, request.user.user._id)
    }
    const response = { room: result, children }
    wsDispatcher.dispatch(config.wsSettings.opTypes.roomUpdate, [response], true)
    reply.send(response)
  }

  async delete (request, reply) {
    const result = await roomService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new RoomController()
