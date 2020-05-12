const os = require('os')
const process = require('process')
const config = require('../../../config')
const userService = require('../../services/user/user-service')
const performanceService = require('../../services/performance/performance-service')
const connectionService = require('../../services/connection/connection-service')
const geoipService = require('../../services/geoip/geoip-service')
const wsDispatcher = require('../ws/ws-dispatcher')
const processName = `${os.hostname()}_${process.pid}`

class ConnectionController {
  async pushConnectionWs (fastify, wss, conn, req) {
    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
      const geoip = await geoipService.get(ipAddress)
      const payload = {
        conn_id: conn.id,
        ip_address: ipAddress,
        process_name: processName
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
        wsDispatcher.dispatch(op, [connection], true)
      }

      return connection
    } catch (err) {
      fastify.log.error(err)
    }
  }

  async pullConnectionWs (fastify, wss, conn, req) {
    const id = conn.connection_id
    if (id) {
      try {
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
          wsDispatcher.dispatch(op, [connection], true)
        }

        return connection
      } catch (err) {
        fastify.log.error(err)
      }
    }
  }
}

module.exports = new ConnectionController()
