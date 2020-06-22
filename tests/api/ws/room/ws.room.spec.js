const test = require('ava')
const consola = require('consola')
const WebSocket = require('ws')
const fastify = require('../../../../api/api')()
const authOps = require('../../.common/auth-ops')
const UserContext = require('../../.context/user-context')
const RoomContext = require('../../.context/room-context')
const data = require('./data')
const user1 = new UserContext(data.user.user1)
const user2 = new UserContext(data.user.user2)
const room1 = new RoomContext(data.room1, user1)
const room2 = new RoomContext(data.room2, user2)
const port = 6002
let ws1
let ws2

test.before('Start API server', async (t) => {
  try {
    const address = await fastify.listen(port)
    consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }
})
authOps.register(fastify, test, 'create the first WS user account for room creation', user1)
authOps.activate(fastify, test, 'activate the WS first user account for room creation', user1)
authOps.register(fastify, test, 'create the second WS user account for room creation', user2)
authOps.activate(fastify, test, 'activate the second WS user account for room creation', user2)

// 1. Subscribe via WebSocket1 and WebSocket2
// 2. User1 creates room1
// 3. User1 adds user2 in room1.moderators
// 4. User2 creates room2
// 5. User2 updates room1
// 6. User1 deletes room1
// 7. User2 deletes room2

test.serial('API "op=\'ROOM_CREATE\'" ', async (t) => {
  const cookie1 = { headers: { cookie: `token=${user1.token}` } }
  ws1 = new WebSocket(`ws://localhost:${port}`, cookie1)
  const ops1 = []
  const p1 = new Promise((resolve, reject) => {
    ws1.on('message', (message) => {
      const data = JSON.parse(message)
      ops1.push(data.op)
      if (
        ops1.filter(op => op.includes('ROOM_CREATE')).length === 2 &&
        ops1.filter(op => op.includes('ROOM_UPDATE')).length === 1 &&
        ops2.filter(op => op.includes('ROOM_DELETE')).length === 1) {
        ws1.terminate()
        resolve()
      }
    })
  })
  const cookie2 = { headers: { cookie: `token=${user2.token}` } }
  ws2 = new WebSocket(`ws://localhost:${port}`, cookie2)
  const ops2 = []
  const p2 = new Promise((resolve, reject) => {
    ws2.on('message', (message) => {
      const data = JSON.parse(message)
      ops2.push(data.op)
      if (
        ops2.filter(op => op.includes('ROOM_CREATE')).length === 1 &&
        ops2.filter(op => op.includes('ROOM_UPDATE')).length === 1 &&
        ops2.filter(op => op.includes('ROOM_DELETE')).length === 2) {
        ws2.terminate()
        resolve()
      }
    })
  })

  await fastify
    .inject({
      method: 'POST',
      url: '/api/room/create',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1.token}`
      },
      payload: room1.payload
    })
    .then((response) => {
      const result = JSON.parse(response.payload)
      room1.record = result
    })
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/moderators/push/${room1.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1.token}`
      },
      payload: {
        user: user2.record._id
      }
    })

  await fastify
    .inject({
      method: 'POST',
      url: '/api/room/create',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2.token}`
      },
      payload: room2.payload
    })
    .then((response) => {
      const result = JSON.parse(response.payload)
      room2.record = result
    })

  await fastify
    .inject({
      method: 'PUT',
      url: `/api/room/update/${room1.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2.token}`
      },
      payload: room1.update
    })

  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/room/delete/${room2.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user2.token}`
      },
      payload: {}
    })

  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/room/delete/${room1.record._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user1.token}`
      },
      payload: {}
    })

  await Promise.all([p1, p2])
  t.pass()
})

test.after('Shutdown API server', async (t) => {
  const p = new Promise((resolve, reject) => {
    setTimeout(async () => {
      await fastify.close()
      resolve()
    }, 1000)
  })
  await p
})
