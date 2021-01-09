const test = require('ava')
let fastify = null
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const inviteOps = require('../.common/invite-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const InviteContext = require('../.context/invite-context')
const data = require('./data')
const inviter = new UserContext(data.user.inviter)
const inviteeMember = new UserContext(data.user.inviteeMember)
const inviteeModerator = new UserContext(data.user.inviteeModerator)
const room = new RoomContext(data.room, inviter)
const invite = new InviteContext(data.invite, inviter, room)

const run = async () => {
  fastify = await require('roomler.api')()

  authOps.register(fastify, test, 'creates the inviter user account', inviter)
  authOps.activate(fastify, test, 'activates the inviter user account', inviter)
  authOps.register(fastify, test, 'creates the invitee member user account', inviteeMember)
  authOps.activate(fastify, test, 'activates the invitee member user account', inviteeMember)
  authOps.register(fastify, test, 'creates the invitee moderator user account', inviteeModerator)
  authOps.activate(fastify, test, 'activates the invitee moderator user account', inviteeModerator)

  roomOps.create(fastify, test, 'create the invite room', room)

  inviteOps.create(fastify, test, 'create invites', invite)
  inviteOps.getInvalidId(fastify, test, 'get with invalid id throws a TypeError', inviter, data.invalidInviteId)
  inviteOps.get(fastify, test, 'get an invite by id', invite)
  inviteOps.getAll(fastify, test, 'get all invites for an inviter', [invite])
  inviteOps.updateInvalidId(fastify, test, 'update with invalid id throws a TypeError', inviter, data.invalidInviteId)
  inviteOps.update(fastify, test, 'update the member to moderator', invite)
  inviteOps.accept(fastify, test, 'accept the first invite', inviteeMember, invite, 0)
  inviteOps.reject(fastify, test, 'reject the second invite', inviteeModerator, invite, 1)
  inviteOps.deleteInvalidId(fastify, test, 'delete with invalid id throws a TypeError', inviter, data.invalidInviteId)
  inviteOps.delete(fastify, test, 'delete the second invite', invite, 1)
  inviteOps.getNotFoundId(fastify, test, 'get with unexisting id throws a ReferenceError', invite, 1)
  inviteOps.updateNotFoundId(fastify, test, 'update with unexisting id throws a ReferenceError', invite, 1)
  inviteOps.deleteNotFoundId(fastify, test, 'delete with unexisting id throws a ReferenceError', invite, 1)

  roomOps.delete(fastify, test, 'deletes the invite room', room, inviter)
  authOps.delete(fastify, test, 'deletes the inviter user account', inviter)
  authOps.delete(fastify, test, 'deletes the invitee member user account', inviteeMember)
  authOps.delete(fastify, test, 'deletes the invitee moderator user account', inviteeModerator)

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}

run()
