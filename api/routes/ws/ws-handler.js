const os = require('os')
const process = require('process')
const config = require('../../../config')
const geoipService = require('../../services/geoip/geoip-service')
const wsDispatcher = require('./ws-dispatcher')
const storage = require('./ws-storage')
const uuid = require('uuid')
const processName = `${os.hostname()}_${process.pid}`

class WsHandler {
  /*
    On Connection:
    1. Push the WS connection in the WS Storage
    2. Create a Connection DB entry & push it in user.connections collection
    3. Notify all Peers based on Rooms
  */
  async onConnection (wss, conn, req) {
    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    const geoip = await geoipService.get(ipAddress)
    console.log(geoip)
    conn.id = uuid()
    if (req.user) {
      conn.user = req.user
      console.log(`WS client '${conn.user.username}' connected on '${processName}'`)
    } else {
      console.log(`WS client 'ANONYMOUS' connected on '${processName}'`)
    }
    storage.push(conn)
    const payload = {
      conn_id: conn.id,
      process_name: processName,
      ip_address: ipAddress
    }
    if (geoip) {
      payload.geoip = geoip
    }
    const connection = await require('../metric/metric-controller').pushConnectionWs(wss, conn, payload)
    conn.connection_id = connection._id

    // notify USER CONNECTION OPENED
    if (conn.user) {
      const op = config.wsSettings.opTypes.connectionOpen
      wsDispatcher.dispatch(op, [connection])
    }
  }

  onMessage (wss, conn, msg) {
    if (msg.op === config.wsSettings.opTypes.messageCreate) {
      return require('../message/message-controller').createWs(wss, conn, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPush) {
      return require('../message/message-reactions-controller').pushWs(wss, conn, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPull) {
      return require('../message/message-reactions-controller').pullWs(wss, conn, msg.payload)
    }
    return null
  }

  /*
    On Close:
    1. Pull out the WS conn from the WS Storage
    2. Close the Connection DB entry & pull it out of the user.connections collection
    3. Notify all Peers based on Rooms
  */
  async onClose (wss, conn) {
    if (conn.user) {
      console.log(`WS Client '${conn.user.username}' disconnected from '${processName}'`)
    } else {
      console.log(`WS Client 'ANONYMOUS' disconnected from '${processName}'`)
    }
    storage.pull(conn)
    if (conn.connection_id) {
      const connection = await require('../metric/metric-controller').pullConnectionWs(wss, conn)
      // notify USER CONNECTION CLOSED
      if (conn.user) {
        const op = config.wsSettings.opTypes.connectionClose
        wsDispatcher.dispatch(op, [connection])
      }
    }
  }
}

module.exports = new WsHandler()
