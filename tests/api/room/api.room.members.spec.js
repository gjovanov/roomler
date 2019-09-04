import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data-members')
const user = new UserContext(data.user)
const user2 = new UserContext(data.user2)
const room = new RoomContext(data.room, user)

authOps.register(fastify, test, 'create the user account for members room creation', user)
authOps.activate(fastify, test, 'activate the user account for members room creation', user)
authOps.register(fastify, test, 'create the second user account for members room creation', user2)
authOps.activate(fastify, test, 'activate the second user account for members room creation', user2)
roomOps.create(fastify, test, 'create the members room', room)

roomOps.push(fastify, test, 'add a single member', 'member', room, user)
roomOps.pull(fastify, test, 'remove a single member', 'member', room, user)
roomOps.updateList(fastify, test, 'set the member list to a list with a single member', 'member', room, user)
roomOps.updateList(fastify, test, 'clear the member list using null', 'member', room, null)

roomOps.push(fastify, test, 'add multiple members', 'member', room, [user, user2])
roomOps.pull(fastify, test, 'remove multiple members', 'member', room, [user2])
roomOps.updateList(fastify, test, 'set the member list to a list with multiple members', 'member', room, [user, user2])
roomOps.updateList(fastify, test, 'clear the member list using an empty array', 'member', room, [])

roomOps.delete(fastify, test, 'delete the members room', room)
authOps.delete(fastify, test, 'delete the members room user', user)
authOps.delete(fastify, test, 'delete the second members room user', user2)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
