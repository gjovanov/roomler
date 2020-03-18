const callService = require('../../services/call/call-service')
const roomService = require('../../services/room/room-service')
const config = require('../../../config')
const wsDispatcher = require('../ws/ws-dispatcher')

class RoomCallsController {
  async pushWs (wss, conn, msg) {
    if (conn.user) {
      const payload = msg
      try {
        // if there are open calls, then a) close them, b) remove pull them from room.calls
        // then create new call and push it to room.calls
        const roomid = payload.roomid
        const userid = conn.user._id
        const openCalls = await callService.getAll(userid, roomid, conn.connection_id, 'open')
        if (openCalls && openCalls.length) {
          const ids = openCalls.map(c => c._id)
          await Promise.all([callService.closeAll(ids), roomService.pullCalls(userid, ids)])
        }
        const call = await callService.create(userid, { room: roomid })
        const room = await roomService.pushCall(userid, call._id)
        wsDispatcher.dispatch(config.wsSettings.opTypes.roomCallOpen, [room], true)
      } catch (err) {
        console.log(err)
      }
    }
  }

  async pullWs (wss, conn, msg) {
    if (conn.user) {
      const payload = msg
      try {
        const roomid = payload.roomid
        const userid = conn.user._id
        const openCalls = await callService.getAll(userid, roomid, conn.connection_id, 'open')
        let room
        if (openCalls && openCalls.length) {
          const ids = openCalls.map(c => c._id)
          await callService.closeAll(ids)
          room = await roomService.pullCalls(userid, ids)
        } else {
          room = await roomService.get(userid, roomid)
        }
        wsDispatcher.dispatch(config.wsSettings.opTypes.roomCallClose, [room], true)
      } catch (err) {
        console.log(err)
      }
    }
  }
}

module.exports = new RoomCallsController()
