const test = require('ava')
let fastify = null
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')

const user1 = new UserContext(data.user.user1)
const user2 = new UserContext(data.user.user2)
const user3 = new UserContext(data.user.user3)
const user4 = new UserContext(data.user.user4)
const room = new RoomContext(data.room, user1)
const room2 = new RoomContext(data.room2, user4)

const run = async () => {
  fastify = await require('roomler.api')()

  authOps.register(fastify, test, 'create the first user account for room creation', user1)
  authOps.activate(fastify, test, 'activate the first user account for room creation', user1)
  authOps.register(fastify, test, 'create the second user account for room creation', user2)
  authOps.activate(fastify, test, 'activate the second user account for room creation', user2)
  authOps.register(fastify, test, 'create the third user account for room creation', user3)
  authOps.activate(fastify, test, 'activate the third user account for room creation', user3)
  authOps.register(fastify, test, 'create the fourth user account for room creation', user4)
  authOps.activate(fastify, test, 'activate the fourth user account for room creation', user4)

  roomOps.create(fastify, test, 'create the room for testing', room)
  roomOps.create(fastify, test, 'create the room2 for testing', room2)
  roomOps.getInvalidId(fastify, test, 'get with invalid id throws a TypeError', user1, data.invalidRoomId)
  roomOps.get(fastify, test, 'get the room for testing by id', room)
  roomOps.getAll(fastify, test, 'get all rooms for testing', [room])
  roomOps.updateInvalidId(fastify, test, 'update with invalid id throws a TypeError', user1, data.invalidMessageId)
  roomOps.update(fastify, test, 'update the name of the room for testing', room)

  // members ops
  roomOps.push(fastify, test, 'add a single member', 'member', room, user2)
  roomOps.push(fastify, test, 'add a single member 2', 'member', room2, user1)
  roomOps.pull(fastify, test, 'remove a single member', 'member', room, user2)
  roomOps.updateList(fastify, test, 'set the member list to a list with a single member', 'member', room, user2)
  roomOps.updateList(fastify, test, 'clear the member list using null', 'member', room, null)
  roomOps.push(fastify, test, 'add multiple members', 'member', room, [user2, user3])
  roomOps.pull(fastify, test, 'remove multiple members', 'member', room, [user3])
  roomOps.updateList(fastify, test, 'set the member list to a list with multiple members', 'member', room, [user2, user3])
  roomOps.getPeers(fastify, test, 'get all peers for testing', [room, room2])
  roomOps.updateList(fastify, test, 'clear the member list using an empty array', 'member', room, [])

  // moderators ops
  roomOps.push(fastify, test, 'add a single moderator', 'moderator', room, user2)
  roomOps.pull(fastify, test, 'remove a single moderator', 'moderator', room, user2)
  roomOps.updateList(fastify, test, 'set the moderator list to a list with a single moderator', 'moderator', room, user2)
  roomOps.updateList(fastify, test, 'clear the moderator list using null', 'moderator', room, null)
  roomOps.push(fastify, test, 'add multiple moderators', 'moderator', room, [user2, user3])
  roomOps.pull(fastify, test, 'remove multiple moderators', 'moderator', room, [user3])
  roomOps.updateList(fastify, test, 'set the moderator list to a list with multiple moderators', 'moderator', room, [user2, user3])
  roomOps.updateList(fastify, test, 'clear the moderator list using an empty array', 'moderator', room, [])

  // owner ops
  roomOps.transfer(fastify, test, 'transfer room ownership to selected user', room, user4)
  roomOps.switch(fastify, test, 'switch moderator to member by owner', 'members', room, user4, user1)
  roomOps.switch(fastify, test, 'switch member to moderator by owner', 'moderators', room, user4, user1)

  roomOps.deleteInvalidId(fastify, test, 'delete with invalid id throws a TypeError', user1, data.invalidRoomId)
  roomOps.delete(fastify, test, 'deletes the room', room, user4)
  roomOps.getNotFoundId(fastify, test, 'get with unexisting id throws a ReferenceError', room)
  roomOps.updateNotFoundId(fastify, test, 'update with unexisting id throws a ReferenceError', room)
  roomOps.deleteNotFoundId(fastify, test, 'delete with unexisting id throws a ReferenceError', room)

  authOps.delete(fastify, test, 'deletes the first room user', user1)
  authOps.delete(fastify, test, 'deletes the second room user', user2)
  authOps.delete(fastify, test, 'deletes the third room user', user3)

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}

run()
