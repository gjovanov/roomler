const userService = require('../../services/user/user-service')
const performanceService = require('../../services/performance/performance-service')
const userConnectionService = require('../../services/user-connection/user-connection-service')

class MetricController {
  async pushUserConnectionWs (wss, conn, payload) {
    try {
      performanceService.performance.mark('UserConnectionCreate start')
      const userConnection = await userConnectionService.create(conn.user ? conn.user._id : null, payload)
      performanceService.performance.mark('UserConnectionCreate end')
      performanceService.performance.measure('UserConnectionCreate', 'UserConnectionCreate start', 'UserConnectionCreate end')

      if (conn.user) {
        performanceService.performance.mark('UserConnectionUpdate start')
        await userService.pushUserConnection(conn.user._id, userConnection._id)
        performanceService.performance.mark('UserConnectionUpdate end')
        performanceService.performance.measure('UserConnectionUpdate', 'UserConnectionUpdate start', 'UserConnectionUpdate end')
      }

      return userConnection
    } catch (err) {
      console.log(err)
    }
  }

  async pullUserConnectionWs (wss, conn) {
    const id = conn.user_connection_id
    if (id) {
      try {
        performanceService.performance.mark('UserConnectionClose start')
        const userConnection = await userConnectionService.close(id)
        performanceService.performance.mark('UserConnectionClose end')
        performanceService.performance.measure('UserConnectionClose', 'UserConnectionCreate start', 'UserConnectionCreate end')

        if (conn.user && userConnection) {
          performanceService.performance.mark('UserConnectionUpdate start')
          await userService.pullUserConnection(conn.user._id, userConnection._id)
          performanceService.performance.mark('UserConnectionUpdate end')
          performanceService.performance.measure('UserConnectionUpdate', 'UserConnectionUpdate start', 'UserConnectionUpdate end')
        }

        return userConnection
      } catch (err) {
        console.log(err)
      }
    }
  }
}

module.exports = new MetricController()
