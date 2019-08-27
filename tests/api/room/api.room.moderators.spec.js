import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data-moderators')
const user = new UserContext(data.user)
const user2 = new UserContext(data.user2)
const room = new RoomContext(data.room, user)

authOps.register(fastify, test, 'creates the user account for moderators room creation', user)
authOps.activate(fastify, test, 'activates the user account for moderators room creation', user)
authOps.register(fastify, test, 'creates the second user account for moderators room creation', user2)
authOps.activate(fastify, test, 'activates the second user account for moderators room creation', user2)
roomOps.create(fastify, test, 'returns newly created moderators room', room)

roomOps.push(fastify, test, 'returns the updated room with the single moderator', 'moderator', room, user)
roomOps.pull(fastify, test, 'returns the updated room without the single moderator', 'moderator', room, user)
roomOps.update(fastify, test, 'returns the updated room with the single moderator', 'moderator', room, user)
roomOps.update(fastify, test, 'returns the updated room without the single moderator', 'moderator', room, null)

roomOps.push(fastify, test, 'returns the updated room with multiple moderators', 'moderator', room, [user, user2])
roomOps.pull(fastify, test, 'returns the updated room without multiple moderators', 'moderator', room, [user2])
roomOps.update(fastify, test, 'returns the updated room with multiple moderators', 'moderator', room, [user, user2])
roomOps.update(fastify, test, 'returns the updated room without multiple moderators', 'moderator', room, [])

roomOps.delete(fastify, test, 'deletes the moderators room', room)
authOps.delete(fastify, test, 'deletes the moderators room user', user)
authOps.delete(fastify, test, 'deletes the second moderators room user', user2)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
