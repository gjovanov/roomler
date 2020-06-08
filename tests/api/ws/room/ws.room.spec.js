const fastify = require('../../../../api/api')()
const authOps = require('../../.common/auth-ops')
const UserContext = require('../../.context/user-context')
const RoomContext = require('../../.context/room-context')
const data = require('./data')
const user1 = new UserContext(data.user.user1)
const user2 = new UserContext(data.user.user2)
const room1 = new RoomContext(data.room1, user1)
const room2 = new RoomContext(data.room2, user2)
const test = require('ava')
const consola = require('consola')
const WebSocket = require('ws')
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

test.serial('API "op=\'ROOM_CREATE\'" ', async (t) => {
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
  const cookie1 = { headers: { cookie: `token=${user1.token}` } }
  ws1 = new WebSocket(`ws://localhost:${port}`, cookie1)
  const p1 = new Promise((resolve, reject) => {
    ws1.on('message', (message) => {
      const data = JSON.parse(message)
      if (data.op.includes('ROOM_CREATE')) {
        t.true(data.op.includes('ROOM_CREATE'))
        console.log('YEAaaaaaaaaaa1')
        resolve()
      }
    })
  })
  const cookie2 = { headers: { cookie: `token=${user2.token}` } }
  ws2 = new WebSocket(`ws://localhost:${port}`, cookie2)
  const p2 = new Promise((resolve, reject) => {
    ws2.on('message', (message) => {
      const data = JSON.parse(message)
      if (data.op.includes('ROOM_CREATE')) {
        t.true(data.op.includes('ROOM_CREATE'))
        console.log('YEAaaaaaaaaaa2')
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
        Authorization: `Bearer ${user2.token}`
      },
      payload: room2.payload
    })

  await Promise.all([p1, p2])
  t.pass()
})

test.after('Shutdown API server', async (t) => {
  ws1.close()
  ws2.close()
  await fastify.close()
})
