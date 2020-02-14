const os = require('os')
const process = require('process')
const fastJson = require('fast-json-stringify')
const messageService = require('../../services/message/message-service')
const roomService = require('../../services/room/room-service')
const channel = require('../../../config').wsSettings.scaleout.channel
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
    let extension = (record, userid) => record
    if (op.startsWith('MESSAGE_')) {
      recepients = messageService.recepients(messages)
      stringify = fastJson(require('../message/message-schema').wsMessage.valueOf())
      extension = messageService.extension
    }
    if (op.startsWith('USER_CONNECTION_') && messages.length && messages[0].user) {
      const rooms = await roomService.getAll(messages[0].user, 0, 10000)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../metric/metric-schema').wsUserConnection.valueOf())
    }
    if (op.includes('ROOM_INVITE_')) {
      const rooms = messages.map(m => m.room)
      console.log(rooms)
      recepients = roomService.recepients(rooms)
      console.log(recepients)
      stringify = fastJson(require('../invite/invite-schema').wsInvite.valueOf())
    }
    if (op.includes('ROOM_PEER_')) {
      const rooms = messages.map(m => m.room)
      const users = messages.map(m => m.users).reduce((a, b) => [...a, ...b], [])

      recepients = roomService.recepients(rooms, users)
      stringify = fastJson(require('../room/room-schema').wsRoomUsers.valueOf())
    }
    // TODO: Add other ROUTES (RECEPIENTS)
    return {
      recepients,
      stringify,
      extension
    }
  }

  sendRecepients (op, recepients, stringify, extension, messages) {
    recepients.forEach((r) => {
      const recepient = JSON.stringify(r)
      if (storage.clients[recepient]) {
        const clientConns = storage.clients[recepient]
        if (clientConns && clientConns.length) {
          if (clientConns[0].user) {
            clientConns.forEach((client) => {
              if (client.readyState === 1) {
                if (messages.length) {
                  const data = messages.map(m => extension(m, r))
                  client.send(stringify({
                    op,
                    data
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
      this.publisher.publish(channel, JSON.stringify({
        process: processName,
        op,
        messages
      }))
    }
  }

  async dispatch (op, messages, scaleout = true) {
    const { recepients, stringify, extension } = await this.getRecepients(op, messages)
    this.sendRecepients(op, recepients, stringify, extension, messages)
    this.scaleoutMessages(op, messages, scaleout)
  }
}

module.exports = new WsDispatcher()
