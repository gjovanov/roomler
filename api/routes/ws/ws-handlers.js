const uuid = require('uuid')
const config = require('../../../config')
class WsHandlers {
  handleConnection (wss, conn, req) {
    conn.id = uuid()
    if (req.user) {
      conn.user = req.user
      console.log(`WS client: ${conn.user.username}`)
    } else {
      console.log('WS client: ANONYMOUS')
    }
  }

  async handleMessage (wss, conn, msg) {
    console.log(`WS message for OP TYPE: ${msg.op}`)
    if (msg.op === config.wsSettings.opTypes.messageCreate) {
      await require('../message/message-controller').createWs(wss, conn, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPush) {
      await require('../message/message-reactions-controller').pushWs(wss, conn, msg.payload)
    } else if (msg.op === config.wsSettings.opTypes.messageReactionPull) {
      await require('../message/message-reactions-controller').pullWs(wss, conn, msg.payload)
    }
  }

  handleClose (wss, conn) {
    console.log('WS Client disconnected.')
  }
}

module.exports = new WsHandlers()
