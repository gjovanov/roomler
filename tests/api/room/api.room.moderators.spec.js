import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data-moderators')
const user = new UserContext(data.user)
const room = new RoomContext(data.room, user)

authOps.register(fastify, test, 'creates the user account for moderators room creation', user)
authOps.activate(fastify, test, 'activates the user account for moderators room creation', user)
roomOps.create(fastify, test, 'returns newly created moderators room', room)

test.serial('API "/api/room/moderators/push" returns the updated room with the single moderator', async (t) => {
  const payload = {
    id: room.record._id,
    user: user.record._id
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/push`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      const moderator = result.moderators[0]
      t.true(moderator._id !== undefined)
      t.true(moderator.username === user.payload.username)
      t.true(moderator.email === user.payload.email)
      t.true(moderator.password === undefined)

      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/pull" returns the updated room without the single moderator', async (t) => {
  const payload = {
    id: room.record._id,
    user: user.record._id
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/pull`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      t.true(room.record.moderators.length === 0)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/update" returns the updated room with the single moderator', async (t) => {
  const payload = {
    id: room.record._id,
    user: user.record._id
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      const moderator = result.moderators[0]
      t.true(moderator._id !== undefined)
      t.true(moderator.username === user.payload.username)
      t.true(moderator.email === user.payload.email)
      t.true(moderator.password === undefined)

      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/update" returns the updated room without the single moderator', async (t) => {
  const payload = {
    id: room.record._id,
    user: null
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      t.true(room.record.moderators.length === 0)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/push" returns the updated room with multiple moderators', async (t) => {
  const payload = {
    id: room.record._id,
    users: [user.record._id]
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/push`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      const moderator = result.moderators[0]
      t.true(moderator._id !== undefined)
      t.true(moderator.username === user.payload.username)
      t.true(moderator.email === user.payload.email)
      t.true(moderator.password === undefined)

      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/pull" returns the updated room without multiple moderators', async (t) => {
  const payload = {
    id: room.record._id,
    users: [user.record._id]
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/pull`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      t.true(room.record.moderators.length === 0)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/update" returns the updated room with multiple moderators', async (t) => {
  const payload = {
    id: room.record._id,
    users: [user.record._id]
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      const moderator = result.moderators[0]
      t.true(moderator._id !== undefined)
      t.true(moderator.username === user.payload.username)
      t.true(moderator.email === user.payload.email)
      t.true(moderator.password === undefined)

      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/moderators/update" returns the updated room without multiple moderators', async (t) => {
  const payload = {
    id: room.record._id,
    users: []
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      },
      payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.true(Array.isArray(room.record.moderators))
      t.true(room.record.moderators.length === 0)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

roomOps.delete(fastify, test, 'deletes the moderators room', room)
authOps.delete(fastify, test, 'deletes the moderators room user', user)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
