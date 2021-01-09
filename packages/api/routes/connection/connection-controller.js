const config = require('roomler.config')
const userService = require('../../services/user/user-service')
const performanceService = require('../../services/performance/performance-service')
const connectionService = require('../../services/connection/connection-service')
const visitService = require('../../services/visit/visit-service')
const callService = require('../../services/call/call-service')
const roomService = require('../../services/room/room-service')
const geoipService = require('../../services/geoip/geoip-service')
const wsDispatcher = require('../ws/ws-dispatcher')

class ConnectionController {
  async pushConnectionWs (fastify, wss, conn, req) {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const geoip = await geoipService.get(ipAddress)
      const payload = {
        conn_id: conn.id,
        ip_address: ipAddress
      }
      if (geoip) {
        payload.geoip = geoip
      }
      performanceService.performance.mark('ConnectionOpen start')
      const connection = await connectionService.create(conn.user ? conn.user._id : null, payload)
      performanceService.performance.mark('ConnectionOpen end')
      performanceService.performance.measure('ConnectionOpen', 'ConnectionOpen start', 'ConnectionOpen end')

      if (conn.user) {
        performanceService.performance.mark('UserConnectionPush start')
        await userService.pushConnection(conn.user._id, connection._id)
        performanceService.performance.mark('UserConnectionPush end')
        performanceService.performance.measure('UserConnectionPush', 'UserConnectionPush start', 'UserConnectionPush end')
      }

      if (conn.user) {
        const op = config.wsSettings.opTypes.connectionOpen
        wsDispatcher.publish(op, [connection])
      }

      return connection
    } catch (err) {
      fastify.log.error(err)
    }
  }

  async updateConnectionWs (fastify, wss, conn, req, update) {
    const id = conn.connection_id
    if (id) {
      try {
        performanceService.performance.mark('ConnectionUpdate start')
        await connectionService.update(id, update)
        performanceService.performance.mark('ConnectionUpdate end')
        performanceService.performance.measure('ConnectionUpdate', 'ConnectionUpdate start', 'ConnectionUpdate end')
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }

  async pullConnectionWs (fastify, wss, conn, req) {
    const id = conn.connection_id
    if (id) {
      try {
        performanceService.performance.mark('ConnCloseTotal start')

        performanceService.performance.mark('VisitClose start')
        visitService.close(id)
        performanceService.performance.mark('VisitClose end')
        performanceService.performance.measure('VisitClose', 'VisitClose start', 'VisitClose end')

        performanceService.performance.mark('CallsGet start')
        let calls = await callService.getAll({
          connection: id,
          status: 'open'
        })
        performanceService.performance.mark('CallsGet end')
        performanceService.performance.measure('CallsGet', 'CallsGet start', 'CallsGet end')
        if (calls && calls.length) {
          performanceService.performance.mark('CallsClose start')
          calls = await Promise.all(calls.map(c => callService.close(c._id)))
          performanceService.performance.mark('CallsClose end')
          performanceService.performance.measure('CallsClose', 'CallsClose start', 'CallsClose end')

          performanceService.performance.mark('RoomCallPull start')
          const rooms = await Promise.all(calls.map(c => roomService.pullCall(conn.user._id, c.room, c._id)))
          performanceService.performance.mark('RoomCallPull end')
          performanceService.performance.measure('RoomCallPull', 'RoomCallPull start', 'RoomCallPull end')

          for (let i = 0; i < calls.length; i++) {
            const call = calls[i]
            const room = rooms[i]
            const result = {
              room,
              call
            }
            const op = config.wsSettings.opTypes.roomCallClose
            wsDispatcher.publish(op, [result])
          }
        }

        performanceService.performance.mark('ConnectionClose start')
        const connection = await connectionService.close(id)
        performanceService.performance.mark('ConnectionClose end')
        performanceService.performance.measure('ConnectionClose', 'ConnectionClose start', 'ConnectionClose end')

        if (conn.user && connection) {
          performanceService.performance.mark('UserConnectionPull start')
          await userService.pullConnection(conn.user._id, connection._id)
          performanceService.performance.mark('UserConnectionPull end')
          performanceService.performance.measure('UserConnectionPull', 'UserConnectionPull start', 'UserConnectionPull end')
        }

        if (conn.user) {
          const op = config.wsSettings.opTypes.connectionClose
          wsDispatcher.publish(op, [connection])
        }
        const visit = {
          status: 'closed',
          connection: {
            _id: id,
            status: 'closed'
          }
        }
        wsDispatcher.publish(config.wsSettings.opTypes.visitClose, [visit])

        performanceService.performance.mark('ConnCloseTotal end')
        performanceService.performance.measure('ConnCloseTotal', 'ConnCloseTotal start', 'ConnCloseTotal end')

        return connection
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }
}

module.exports = new ConnectionController()
