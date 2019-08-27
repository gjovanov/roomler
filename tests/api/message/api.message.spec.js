import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')
const owner = new UserContext(data.owner)
const moderator = new UserContext(data.moderator)
const member = new UserContext(data.member)
const room = new RoomContext(data.room, owner)
const messages = []

authOps.register(fastify, test, 'creates the owner user account for messages room creation', owner)
authOps.activate(fastify, test, 'activates the owner user account for messages room creation', owner)
authOps.register(fastify, test, 'creates the moderator user account for messages room creation', moderator)
authOps.activate(fastify, test, 'activates the moderator user account for messages room creation', moderator)
authOps.register(fastify, test, 'creates the member user account for messages room creation', member)
authOps.activate(fastify, test, 'activates the member user account for messages room creation', member)

roomOps.create(fastify, test, 'returns newly created messages room', room)
roomOps.push(fastify, test, 'add the moderator to the messages room', 'moderator', room, moderator)
roomOps.push(fastify, test, 'add the member to the messages room', 'member', room, member)

test.serial(`API "/api/message/create" room owner creates an array of messages`, async (t) => {
  const payload = {
    room: room.record._id,
    message: [{
      room: room.record._id,
      content: 'Greetings by the room owner'
    },
    {
      room: room.record._id,
      content: 'The room owner welcomes you on board'
    }
    ]
  }
  await fastify
    .inject({
      method: 'POST',
      url: `/api/message/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${owner.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      result.forEach(message => messages.push(message))
      t.pass()
    })
    .catch((e) => {
      t.fail(e)
    })
})

test.serial(`API "/api/message/create" room moderator creates a single message`, async (t) => {
  const payload = {
    room: room.record._id,
    message: {
      room: room.record._id,
      content: 'Greetings by the room moderator'
    }
  }
  await fastify
    .inject({
      method: 'POST',
      url: `/api/message/create`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${moderator.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      result.forEach(message => messages.push(message))
      t.pass()
    })
    .catch((e) => {
      t.fail(e)
    })
})

test.serial(`API "/api/message/get-all" room member gets all 3 messages`, async (t) => {
  const payload = {
    room: room.record._id,
    message: {
      room: room.record._id,
      content: 'Greetings by the room moderator'
    }
  }
  await fastify
    .inject({
      method: 'GET',
      url: `/api/message/get-all?roomid=${room.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${member.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      console.log(result)
      t.true(Array.isArray(result) && result.length === 3)
      t.pass()
    })
    .catch((e) => {
      t.fail(e)
    })
})

roomOps.delete(fastify, test, 'deletes the messages room', room)
authOps.delete(fastify, test, 'deletes the owners user used in messages room', owner)
authOps.delete(fastify, test, 'deletes the moderators user used in messages room', moderator)
authOps.delete(fastify, test, 'deletes the members user used in messages room', member)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
