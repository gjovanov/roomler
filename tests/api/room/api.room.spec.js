import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')
const user = new UserContext(data.user)
const room = new RoomContext(data.room, user)

authOps.register(fastify, test, 'create the user account for room creation', user)
authOps.activate(fastify, test, 'activate the user account for room creation', user)

roomOps.create(fastify, test, 'create the room for testing', room)
roomOps.get(fastify, test, 'get the room for testing by id', room)
roomOps.getAll(fastify, test, 'get all rooms for testing', [room])
roomOps.update(fastify, test, 'update the name of the room for testing', room)

roomOps.deleteInvalidId(fastify, test, 'delete with invalid id throws a TypeError', user, data.invalidRoomId)
roomOps.delete(fastify, test, 'deletes the room', room)
authOps.delete(fastify, test, 'deletes the room user', user)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
