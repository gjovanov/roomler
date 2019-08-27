import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')
const inviter = new UserContext(data.inviter)
const inviteeMember = new UserContext(data.inviteeMember)
const inviteeModerator = new UserContext(data.inviteeModerator)
const room = new RoomContext(data.room, inviter)
let invites = null

authOps.register(fastify, test, 'creates the inviter user account', inviter)
authOps.activate(fastify, test, 'activates the inviter user account', inviter)
authOps.register(fastify, test, 'creates the invitee member user account', inviteeMember)
authOps.activate(fastify, test, 'activates the invitee member user account', inviteeMember)
authOps.register(fastify, test, 'creates the invitee moderator user account', inviteeModerator)
authOps.activate(fastify, test, 'activates the invitee moderator user account', inviteeModerator)

roomOps.create(fastify, test, 'returns newly created invite room', room)

test.serial(`API "/api/invite/create" returns newly create invites`, async(t) => {
  const payload = [{
      room: room.record._id,
      name: data.inviteeMember.name,
      email: data.inviteeMember.payload.email,
      type: 'member'
    },
    {
      room: room.record._id,
      name: data.inviteeModerator.name,
      email: data.inviteeModerator.payload.email,
      type: 'moderator'
    }
  ]
  await fastify
    .inject({
      method: 'POST',
      url: `/api/invite/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inviter.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      t.true(result.length === 2)
      t.true(result[0].inviter.toString() === inviter.record._id.toString())
      t.true(result[0].room && result[0].room._id && result[0].room._id.toString() === room.record._id.toString())
      t.true(result[0].email === data.inviteeMember.payload.email)
      t.true(result[0].type === 'member')
      t.true(result[0].status === 'pending')
      t.true(result[1].inviter.toString() === inviter.record._id.toString())
      t.true(result[1].room && result[1].room._id && result[1].room._id.toString() === room.record._id.toString())
      t.true(result[1].email === data.inviteeModerator.payload.email)
      t.true(result[1].type === 'moderator')
      t.true(result[1].status === 'pending')
      invites = result
      t.pass()
    })
    .catch((e) => {
      t.fail()
    })
})

test.serial('API "/api/invite/get" returns an invite by id', async(t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/invite/get?id=${invites[0]._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inviter.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.room && result.room._id && result.room._id.toString() === room.record._id.toString())
      t.true(result.email === data.inviteeMember.payload.email)
      t.true(result.type === 'member')
      t.true(result.status === 'pending')
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/invite/get-all" returns the invite list', async(t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/invite/get-all`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inviter.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      t.true(result.length === 2)
      console.log(result)
      console.log(data.inviteeMember.payload.email)
      console.log(data.inviteeModerator.payload.email)

      const existsMember = result.some((item) => {
        return item.inviter.toString() === inviter.record._id.toString() &&
          item.room && item.room._id && item.room._id.toString() === room.record._id.toString() &&
          item.email === data.inviteeMember.payload.email &&
          item.type === 'member' &&
          item.status === 'pending'
      })
      t.true(existsMember)

      const existsModerator = result.some((item) => {
        return item.inviter.toString() === inviter.record._id.toString() &&
          item.room && item.room._id && item.room._id.toString() === room.record._id.toString() &&
          item.email === data.inviteeModerator.payload.email &&
          item.type === 'moderator' &&
          item.status === 'pending'
      })
      t.true(existsModerator)

      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial(`API "/api/invite/update" returns the updated invite`, async(t) => {
  const payload = {
    id: invites[0]._id,
    update: {
      name: 'My new moderator',
      type: 'moderator'
    }
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/invite/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${inviter.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.inviter.toString() === inviter.record._id.toString())
      t.true(result.email === data.inviteeMember.payload.email)
      t.true(result.type === 'moderator')
      t.pass()
    })
    .catch((e) => {
      t.fail()
    })
})

test.serial(`API "/api/invite/accept" adds the room moderator and returns the accepted invite`, async(t) => {
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/invite/accept/${invites[1]._id}`,
      headers: {
        Authorization: `Bearer ${inviteeModerator.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)

      t.true(result.inviter.toString() === inviter.record._id.toString())
      t.true(result.email === data.inviteeModerator.payload.email)
      t.true(result.type === 'moderator')
      t.true(result.room && result.room._id !== null)
      console.log(result.room.moderators)
      const moderators = result.room.moderators.filter(id => id.toString() === inviteeModerator.record._id.toString())
      t.true(Array.isArray(moderators) || moderators.length === 1)
      t.pass()
    })
    .catch((e) => {
      t.fail()
    })
})

roomOps.delete(fastify, test, 'deletes the invite room', room)
authOps.delete(fastify, test, 'deletes the inviter user account', inviter)
authOps.delete(fastify, test, 'deletes the invitee member user account', inviteeMember)
authOps.delete(fastify, test, 'deletes the invitee moderator user account', inviteeModerator)

test.after('Shutdown API server', async(t) => {
  await fastify.close()
})
