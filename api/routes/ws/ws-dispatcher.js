const os = require('os')
const process = require('process')
const fastJson = require('fast-json-stringify')
const messageService = require('../../services/message/message-service')
const roomService = require('../../services/room/room-service')
const storage = require('./ws-storage')
const processName = `${os.hostname()}_${process.pid}`

class WsDispatcher {
  constructor () {
    storage.clients = {}
    storage.anonymous = 'Anonymous'
    this.publisher = null
  }

  initPublisher (publisher) {
    this.publisher = publisher
  }

  async getRecepients (op, messages) {
    let recepients = []
    let stringify
    if (op.startsWith('MESSAGE_')) {
      recepients = messageService.recepients(messages)
      stringify = fastJson(require('../message/message-schema').wsMessage.valueOf())
    }
    if (op.startsWith('USER_CONNECTION_') && messages.length && messages[0].user) {
      const rooms = await roomService.getAll(messages[0].user, 0, 10000)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../auth/auth-schema').wsUserConnection.valueOf())
    }
    // TODO: Add other ROUTES (RECEPIENTS)
    return {
      recepients,
      stringify
    }
  }

  sendRecepients (op, recepients, stringify, messages) {
    recepients.forEach((r) => {
      const recepient = JSON.stringify(r)
      console.log(recepient)
      if (storage.clients[recepient]) {
        const clientConns = storage.clients[recepient]
        if (clientConns && clientConns.length) {
          console.log(`CONNS: ${JSON.stringify(clientConns[0].user)}`)
          if (clientConns[0].user) {
            const username = clientConns[0].user.username
            clientConns.forEach((client) => {
              if (client.readyState === 1) {
                console.log(`SENDING TO '${username}' messages '${messages.length}' messages on ${processName}`)
                if (messages.length) {
                  client.send(stringify({
                    op,
                    data: messages
                  }))
                }
              }
            })
          }
        }
      }
    })
  }

  scaleoutMessages (op, messages, scaleout) {
    if (scaleout && this.publisher && this.publisher.status === 'ready') {
      console.log(`PUBLISHING: ${processName}`)
      this.publisher.publish('global', JSON.stringify({
        process: processName,
        op,
        messages
      }))
    }
  }

  async dispatch (op, messages, scaleout = true) {
    const { recepients, stringify } = await this.getRecepients(op, messages)
    this.sendRecepients(op, recepients, stringify, messages)
    this.scaleoutMessages(op, messages, scaleout)
  }
}

module.exports = new WsDispatcher()
