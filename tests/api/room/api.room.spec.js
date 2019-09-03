import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')
const user = new UserContext(data.user)
const room = new RoomContext(data.room, user)

authOps.register(fastify, test, 'creates the user account for room creation', user)
authOps.activate(fastify, test, 'activates the user account for room creation', user)
roomOps.create(fastify, test, 'returns newly created room', room)

test.serial('API "/api/room/get" returns a room by id', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/room/get?id=${room.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.name === room.payload.name)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      room.record = result
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/get-all" returns a room list', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/room/get-all`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${room.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      const first = result[0]
      t.true(first._id !== undefined)
      t.true(first.name === room.payload.name)
      t.true(first.createdAt !== undefined)
      t.true(first.updatedAt !== undefined)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/room/update"/:id returns the updated room', async (t) => {
  const payload = {
    name: room.newname
  }
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/update/${room.record._id}`,
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
      t.true(result.name === room.newname)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

// deletes a room by id
// roomOps.delete(fastify, test, 'deletes the room', room)
authOps.delete(fastify, test, 'deletes the room user', user)

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
