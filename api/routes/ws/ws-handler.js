
const os = require('os')
const process = require('process')
const { v4: uuid } = require('uuid')
const config = require('../../../config')
const storage = require('./ws-storage')
const processName = `${os.hostname()}_${process.pid}`

/*
WS Message (Command) handler
*/
class WsHandler {
  /*
    On Connection:
    1. Push the WS connection in the WS Storage
    2. Create a Connection DB entry & push it in user.connections collection
    3. Notify all Peers based on Rooms
  */
  async onConnection (fastify, wss, conn, req) {
    conn.id = uuid()

    if (req.user) {
      conn.user = req.user
      fastify.log.info(`WS client '${conn.user.username}' connected on '${processName}'`)
    } else {
      fastify.log.info(`WS client 'ANONYMOUS' connected on '${processName}'`)
    }
    storage.push(conn)

    const connection = await require('../connection/connection-controller').pushConnectionWs(fastify, wss, conn, req)
    fastify.log.info(`WS connection_id: '${connection._id}'`)
    conn.connection_id = connection._id
    conn.send(JSON.stringify({
      op: 'HELLO',
      data: connection._id
    }))
  }

  onMessage (fastify, wss, conn, req, msg) {
    if (msg.op === config.wsSettings.opTypes.messageCreate) {
      return require('../message/message-controller').createWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageUpdate) {
      return require('../message/message-controller').updateWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPush) {
      return require('../message/message-reactions-controller').pushWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPull) {
      return require('../message/message-reactions-controller').pullWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.connectionUpdate) {
      return require('../connection/connection-controller').updateConnectionWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.roomCallOpen) {
      return require('../room/room-calls-controller').pushCallWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.roomCallClose) {
      return require('../room/room-calls-controller').pullCallWs(fastify, wss, conn, req, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.visitOpen) {
      return require('../visit/visit-controller').openVisitWs(fastify, wss, conn, req, msg.payload)
    }
    return null
  }

  /*
    On Close:
    1. Pull out the WS conn from the WS Storage
    2. Close the Connection DB entry & pull it out of the user.connections collection
    3. Notify all Peers based on Rooms
  */
  async onClose (fastify, wss, conn, req) {
    if (conn.user) {
      fastify.log.info(`WS Client '${conn.user.username}' disconnected from '${processName}'`)
    } else {
      fastify.log.info(`WS Client 'ANONYMOUS' disconnected from '${processName}'`)
    }
    storage.pull(conn)
    await require('../connection/connection-controller').pullConnectionWs(fastify, wss, conn, req)
  }

  async onShutdown (fastify, wss) {
    fastify.log.info('ON SHUTDOWN')
    for (const client in storage.clients) {
      const clientConns = storage.clients[client]
      await Promise.all(clientConns.map(conn => require('../connection/connection-controller').pullConnectionWs(fastify, wss, conn)))
    }
  }
}

module.exports = new WsHandler()
