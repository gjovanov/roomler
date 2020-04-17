const userService = require('../../services/user/user-service')
const performanceService = require('../../services/performance/performance-service')
const connectionService = require('../../services/connection/connection-service')

class ConnectionController {
  async pushConnectionWs (fastify, wss, conn, payload) {
    try {
      performanceService.performance.mark('ConnectionCreate start')
      const connection = await connectionService.create(conn.user ? conn.user._id : null, payload)
      performanceService.performance.mark('ConnectionCreate end')
      performanceService.performance.measure('ConnectionCreate', 'ConnectionCreate start', 'ConnectionCreate end')

      if (conn.user) {
        performanceService.performance.mark('ConnectionUpdate start')
        await userService.pushConnection(conn.user._id, connection._id)
        performanceService.performance.mark('ConnectionUpdate end')
        performanceService.performance.measure('ConnectionUpdate', 'ConnectionUpdate start', 'ConnectionUpdate end')
      }

      return connection
    } catch (err) {
      fastify.log.error(err)
    }
  }

  async pullConnectionWs (fastify, wss, conn) {
    const id = conn.connection_id
    if (id) {
      try {
        performanceService.performance.mark('ConnectionClose start')
        const connection = await connectionService.close(id)
        performanceService.performance.mark('ConnectionClose end')
        performanceService.performance.measure('ConnectionClose', 'ConnectionCreate start', 'ConnectionCreate end')

        if (conn.user && connection) {
          performanceService.performance.mark('ConnectionUpdate start')
          await userService.pullConnection(conn.user._id, connection._id)
          performanceService.performance.mark('ConnectionUpdate end')
          performanceService.performance.measure('ConnectionUpdate', 'ConnectionUpdate start', 'ConnectionUpdate end')
        }

        return connection
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }
}

module.exports = new ConnectionController()
