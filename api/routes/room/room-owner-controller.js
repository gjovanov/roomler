const userService = require('../../services/user/user-service')
const roomService = require('../../services/room/room-service')
const config = require('../../../config')
const wsDispatcher = require('../ws/ws-dispatcher')

class RoomOwnerController {
  async transfer (request, reply) {
    const payload = request.body
    const id = request.params.id
    const result = await roomService.transfer(request.user.user._id, id, payload)
    const userids = Array.isArray(payload.users) ? payload.users : (payload.user ? [payload.user] : [])
    const users = await userService.getAll({ ids: userids })
    wsDispatcher.dispatch(config.wsSettings.opTypes.roomPeerRoleUpdate, [{ room: result, users }], true)
    reply.send({ room: result, users })
  }
}

module.exports = new RoomOwnerController()
