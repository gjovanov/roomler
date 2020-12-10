const os = require('os')
const process = require('process')
const fastJson = require('fast-json-stringify')
const userService = require('../../services/user/user-service')
const messageService = require('../../services/message/message-service')
const roomService = require('../../services/room/room-service')
const subscriptionService = require('../../services/subscription/subscription-service')
const channel = require('../../../config').wsSettings.scaleout.channel
// const subscription = require('../../models/subscription')
const storage = require('./ws-storage')
const processName = `${os.hostname()}_${process.pid}`

/*
WS Event Dispatcher
*/
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
    let notifications = false
    if (op.startsWith('MESSAGE_')) {
      recepients = messageService.recepients(messages)
      stringify = fastJson(require('../message/message-schema').wsMessage.valueOf())
      extension = messageService.extension
      notifications = true
    }
    if (op.startsWith('CONNECTION_') && messages.length && messages[0].user) {
      const rooms = await roomService.getAll(messages[0].user, 0, 10000)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../connection/connection-schema').wsConnection.valueOf())
    }
    if (op.startsWith('ROOM_CREATE')) {
      const rooms = messages
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../room/room-schema').wsRoomCreate.valueOf())
    }
    if (op.startsWith('ROOM_UPDATE')) {
      const parents = messages.map(m => m.parents).reduce((a, b) => a.concat(b), [])
      const children = messages.map(m => m.children).reduce((a, b) => a.concat(b), [])
      const rooms = messages.map(m => m.room).concat(children).concat(parents)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../room/room-schema').wsRoomUpdate.valueOf())
    }
    if (op.startsWith('ROOM_DELETE')) {
      const parents = messages.map(m => m.parents).reduce((a, b) => a.concat(b), [])
      const children = messages.map(m => m.children).reduce((a, b) => a.concat(b), [])
      const rooms = messages.map(m => m.room).concat(children).concat(parents)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../room/room-schema').wsRoomDelete.valueOf())
    }
    if (op.startsWith('ROOM_INVITE_')) {
      const rooms = messages.map(m => m.room)
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../invite/invite-schema').wsInvite.valueOf())
    }
    if (op.startsWith('ROOM_PEER_')) {
      const rooms = messages.map(m => m.room)
      const users = messages.map(m => m.users).reduce((a, b) => [...a, ...b], [])

      recepients = roomService.recepients(rooms, users)
      stringify = fastJson(require('../room/room-schema').wsRoomUsers.valueOf())
    }
    if (op.startsWith('ROOM_CALL_')) {
      const rooms = messages.map(m => m.room)
      // TODO: notify peers not members of these rooms???
      recepients = roomService.recepients(rooms)
      stringify = fastJson(require('../room/room-schema').wsRoomCall.valueOf())
      notifications = true
    }
    if (op.startsWith('VISIT_')) {
      const users = await userService.getAdmins()
      recepients = users.map(u => u._id)
      stringify = fastJson(require('../visit/visit-schema').wsVisit.valueOf())
    }
    // TODO: Add other ROUTES (RECEPIENTS)
    return {
      recepients,
      stringify,
      extension,
      notifications
    }
  }

  async getSubscriptions (recepients) {
    const subscriptions = await subscriptionService.getAll(recepients)
    return subscriptions
  }

  send (op, recepients, stringify, extension, messages) {
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

  sendNotifications (op, messages, subscriptions) {
    subscriptions.forEach((subscription) => {
      messages.forEach(async (message) => {
        try {
          let send = false
          let content = ''
          if (op.startsWith('MESSAGE_')) {
            if (JSON.stringify(subscription.user) !== JSON.stringify(message.author)) {
              send = true
              content = message.content
            }
          } else if (op.startsWith('ROOM_CALL_OPEN')) {
            if (JSON.stringify(subscription.user) !== JSON.stringify(message.call.userObj._id)) {
              send = true
              content = `${message.call.userObj.username} joined the call in the room '${message.room.name}'`
            }
          } else if (op.startsWith('ROOM_CALL_CLOSE')) {
            if (JSON.stringify(subscription.user) !== JSON.stringify(message.call.userObj._id)) {
              send = true
              content = `${message.call.userObj.username} left the call from the room '${message.room.name}'`
            }
          }

          if (send) {
            await subscriptionService.send(subscription, content)
          }
        } catch (e) {
          console.log(e)
        }
      })
    })
  }

  async publish (op, messages) {
    if (this.publisher && this.publisher.status === 'ready') {
      this.publisher.publish(channel, JSON.stringify({
        process: processName,
        op,
        messages
      }))
    } else {
      this.dispatch(op, messages)
    }

    const { recepients, notifications } = await this.getRecepients(op, messages)
    let subscriptions = []
    if (notifications) {
      subscriptions = await this.getSubscriptions(recepients)
    }
    if (notifications) {
      subscriptions = await this.getSubscriptions(recepients)
    }
    this.sendNotifications(op, messages, subscriptions)
  }

  async dispatch (op, messages) {
    const { recepients, stringify, extension } = await this.getRecepients(op, messages)
    this.send(op, recepients, stringify, extension, messages)
  }
}

module.exports = new WsDispatcher()
