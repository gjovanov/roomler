const callService = require('../../services/call/call-service')
const roomService = require('../../services/room/room-service')
const config = require('../../../config')
const wsDispatcher = require('../ws/ws-dispatcher')

class RoomCallsController {
  async push (request, reply) {
    // if there are open calls, then a) close them, b) remove pull them from room.calls
    // then create new call and push it to room.calls
    const roomid = request.params.id
    const userid = request.user.user._id
    const openCalls = await callService.getAll(request.user.user._id, roomid, 'open')
    if (openCalls && openCalls.length) {
      const ids = openCalls.map(c => c._id)
      await Promise.all([callService.closeAll(ids), roomService.pullCalls(userid, ids)])
    }
    const call = await callService.create(request.user.user._id, { room: roomid })
    const room = await roomService.pushCall(request.user.user._id, call._id)
    wsDispatcher.dispatch(config.wsSettings.opTypes.roomCallOpen, [room], true)
    reply.send(room)
  }

  async pull (request, reply) {
    const roomid = request.params.id
    const userid = request.user.user._id
    const openCalls = await callService.getAll(request.user.user._id, roomid, 'open')
    let room
    if (openCalls && openCalls.length) {
      const ids = openCalls.map(c => c._id)
      await callService.closeAll(ids)
      room = await roomService.pullAllCalls(userid, ids)
    } else {
      room = await roomService.get(userid, roomid)
    }
    wsDispatcher.dispatch(config.wsSettings.opTypes.roomCallClose, [room], true)
    reply.send(room)
  }
}

module.exports = new RoomCallsController()
