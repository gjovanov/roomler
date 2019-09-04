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

authOps.register(fastify, test, 'create the user account for moderators room creation', user)
authOps.activate(fastify, test, 'activate the user account for moderators room creation', user)
authOps.register(fastify, test, 'create the second user account for moderators room creation', user2)
authOps.activate(fastify, test, 'activate the second user account for moderators room creation', user2)
roomOps.create(fastify, test, 'create the moderators room', room)

roomOps.push(fastify, test, 'add a single moderator', 'moderator', room, user)
roomOps.pull(fastify, test, 'remove a single moderator', 'moderator', room, user)
roomOps.updateList(fastify, test, 'set the moderator list to a list with a single moderator', 'moderator', room, user)
roomOps.updateList(fastify, test, 'clear the moderator list using null', 'moderator', room, null)

roomOps.push(fastify, test, 'add multiple moderators', 'moderator', room, [user, user2])
roomOps.pull(fastify, test, 'remove multiple moderators', 'moderator', room, [user2])
roomOps.updateList(fastify, test, 'set the moderator list to a list with multiple moderators', 'moderator', room, [user, user2])
roomOps.updateList(fastify, test, 'clear the moderator list using an empty array', 'moderator', room, [])

roomOps.delete(fastify, test, 'delete the moderators room', room)
authOps.delete(fastify, test, 'delete the moderators room user', user)
authOps.delete(fastify, test, 'delete the second moderators room user', user2)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
