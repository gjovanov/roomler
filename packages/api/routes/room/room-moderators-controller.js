const userService = require('../../services/user/user-service')
const roomService = require('../../services/room/room-service')
const config = require('roomler.config')
const wsDispatcher = require('../ws/ws-dispatcher')

class RoomModeratorsController {
  async push (request, reply) {
    const payload = request.body
    const id = request.params.id
    const room = await roomService.get(request.user.user._id, {
      id
    })
    const payloadUsers = (Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : []))
    const userids = payloadUsers.filter(u =>
      room.owner.toString() !== u &&
      !room.members.map(m => m.toString()).includes(u) &&
      !room.moderators.map(m => m.toString()).includes(u))
    const result = await roomService.push(request.user.user._id, id, 'moderators', {
      users: userids
    })
    const users = await userService.getAll({ ids: userids })
    wsDispatcher.publish(config.wsSettings.opTypes.roomPeerAdd, [{ room: result, users }])
    reply.send({ room: result, users })
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.updateList(request.user.user._id, id, 'moderators', payload)
    const userids = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const users = await userService.getAll({ ids: userids })
    wsDispatcher.publish(config.wsSettings.opTypes.roomPeerRoleUpdate, [{ room: result, users }])
    reply.send({ room: result, users })
  }

  async pull (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.pull(request.user.user._id, id, 'moderators', payload)
    const userids = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const users = await userService.getAll({ ids: userids })
    wsDispatcher.publish(config.wsSettings.opTypes.roomPeerRemove, [{ room: result, users }])
    reply.send({ room: result, users })
  }

  async switch (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.switch(request.user.user._id, id, 'moderators', payload)
    const userids = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const users = await userService.getAll({ ids: userids })
    wsDispatcher.publish(config.wsSettings.opTypes.roomPeerRoleUpdate, [{ room: result, users }])
    reply.send({ room: result, users })
  }
}

module.exports = new RoomModeratorsController()
