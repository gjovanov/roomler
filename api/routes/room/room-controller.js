const userService = require('../../services/user/user-service')
const roomService = require('../../services/room/room-service')
const callService = require('../../services/call/call-service')
const messageService = require('../../services/message/message-service')
const config = require('../../../config')
const wsDispatcher = require('../ws/ws-dispatcher')

class RoomController {
  async get (request, reply) {
    const user = request.user
    const result = await roomService.get(user && user.user ? user.user._id : null, request.query)
    reply.send(result)
  }

  async getAll (request, reply) {
    const userid = request.user.user._id
    const rooms = await roomService.getAll(userid, request.query.page, request.query.size)
    const ids = rooms
      .map(r => [r.owner, ...r.members, ...r.moderators])
      .reduce((a, b) => [...a, ...b], [])
    const peers = await userService.getAll({ ids })
    const calls = rooms.map(r => r.calls).reduce((a, b) => a.concat(b), [])
    const messages = []

    const lists = await Promise.all([
      callService.getAll({ ids: calls, status: 'open' }),
      ...rooms.map(r => messageService.getAll(userid, 0, 10, { room: r._id })
      )])
    for (let i = 0; i < rooms.length; i++) {
      messages.push({
        roomid: rooms[i]._id,
        messages: lists[i + 1] // 0th position are calls, then come the room messages
      })
    }
    // if messages contain info about ex peers (removed from the room)
    // then download user info for those ex peers
    const roomPeers = peers.map(u => u._id.toString())
    const messagePeers = [...new Set(
      messages
        .map(m => m.messages)
        .reduce((a, b) => [...a, ...b], [])
        .map(message => [message.author.toString(), ...message.mentions.map(u => u.toString()), ...message.reactions.map(r => r.user.toString())])
        .reduce((a, b) => [...a, ...b], []))]

    const exPeers = messagePeers.filter(p => !roomPeers.includes(p))
    if (exPeers.length) {
      const users = await userService.getAll({ ids: exPeers })
      users.forEach((u) => {
        peers.push(u)
      })
    }

    const result = {
      peers,
      rooms,
      messages,
      calls: lists[0]
    }
    reply.send(result)
  }

  async explore (request, reply) {
    const result = await roomService.explore(request.query.search, request.query.page, request.query.size)
    reply.send(result)
  }

  async create (request, reply) {
    const payload = request.body
    let parentRoom = null
    if (payload.parent_id) {
      parentRoom = await roomService.get(request.user.user._id, {
        id: payload.parent_id
      }, ['owner', 'moderators'])
    }
    roomService.slugify(payload, parentRoom)
    const result = await roomService.create(request.user.user._id, payload)
    const parents = result.is_open ? await roomService.getParents(result) : []
    wsDispatcher.publish(config.wsSettings.opTypes.roomCreate, [result, ...parents])
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    let result
    let children = []
    if (!payload.name) {
      result = await roomService.update(request.user.user._id, id, update)
    } else {
      // slugify using parent's name and rename the children
      const room = await roomService.get(request.user.user._id, {
        id
      })
      const parentRoom = await roomService.getParent(room)
      roomService.slugify(payload, parentRoom)
      result = await roomService.update(request.user.user._id, id, update)
      await roomService.renameChildren(room.name, payload.name)
      children = await roomService.getChildren(result, request.user.user._id)
    }
    const response = { room: result, children }
    const parents = result.is_open ? await roomService.getParents(result) : []
    wsDispatcher.publish(config.wsSettings.opTypes.roomUpdate, [response, ...parents])
    reply.send(response)
  }

  async delete (request, reply) {
    const room = await roomService.get(request.user.user._id, {
      id: request.params.id
    })
    const children = await roomService.getChildren(room, request.user.user._id)
    const parents = await roomService.getParents(room)

    const isOwner = !!([room, ...parents].find(r => r.owner.toString() === request.user.user._id.toString()))
    if (!isOwner) {
      throw new Error('Delete operation not allowed! You need to be owner of either the this or any parent room.')
    }
    const result = await roomService.delete(room)
    const response = {
      room,
      parents,
      children,
      result
    }
    wsDispatcher.publish(config.wsSettings.opTypes.roomDelete, [response])
    reply.send(response)
  }
}

module.exports = new RoomController()
