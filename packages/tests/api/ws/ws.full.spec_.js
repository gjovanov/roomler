const test = require('ava')
const consola = require('consola')
const WebSocket = require('ws')
const { v4: uuid } = require('uuid')
let fastify = null
const authOps = require('../.common/auth-ops')
const roomOps = require('../.common/room-ops')
const inviteOps = require('../.common/invite-ops')
const messageOps = require('../.common/message-ops')
const callOps = require('../.common/call-ops')
const UserContext = require('../.context/user-context')
const RoomContext = require('../.context/room-context')
const data = require('./data')
const user1 = new UserContext(data.user.user1)
const user2 = new UserContext(data.user.user2)
const user3 = new UserContext(data.user.user3)
const user4 = new UserContext(data.user.user4)
const room1 = new RoomContext(data.room1, user1)
const room2 = new RoomContext(data.room2, user2)
const port = 6002
let ws1
let ws2
let ws3
let ws4

// helper method to WAIT A BIT
const waitABit = (duration = 5) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}

const run = async () => {
  try {
    fastify = await require('roomler.api')()
    const address = await fastify.listen(port)
    consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }

  authOps.register(fastify, test, 'create the first WS user account for room creation', user1)
  authOps.activate(fastify, test, 'activate the WS first user account for room creation', user1)
  authOps.register(fastify, test, 'create the second WS user account for room creation', user2)
  authOps.activate(fastify, test, 'activate the second WS user account for room creation', user2)
  authOps.register(fastify, test, 'create the third WS user account for room creation', user3)
  authOps.activate(fastify, test, 'activate the third WS user account for room creation', user3)
  authOps.register(fastify, test, 'create the fourth WS user account for room creation', user4)
  authOps.activate(fastify, test, 'activate the fourth WS user account for room creation', user4)

  // ####################### WEB SOCKET FULL SCENARIO #######################
  // In this full scenario, first we create all 4x users, then create 2x rooms and add moderators/members,
  // then each user expects a certain number of WS socket events (messages) to receive
  //
  // room1 { name: 'Parent',  owner: user1, moderators: [user2], members: [user3]}
  // room1 messages: [message1, message2]
  // room2 { name: 'Parent.Child', owner: user2, moderators: [user1], members: [user4]}
  // room2 messages: [message3(reaction=👍)]
  // ########################################################################
  test.serial('API "op=\'ROOM_CREATE\'" ', async (t) => {
    const cookie1 = { headers: { cookie: `token=${user1.token}` } }
    ws1 = new WebSocket(`ws://localhost:${port}`, cookie1)
    await waitABit()
    const p1 = new Promise((resolve) => {
      const ops = []
      ws1.on('ping', () => {
        console.log('PING1')
      })
      ws1.on('message', (message) => {
        const msg = JSON.parse(message)
        ops.push(msg.op)
        const expectedOps = [
          { op: 'ROOM_CREATE', count: 2 },
          { op: 'ROOM_UPDATE', count: 1 },
          { op: 'ROOM_DELETE', count: 1 },
          { op: 'MESSAGE_CREATE', count: 1 },
          { op: 'MESSAGE_UPDATE', count: 1 },
          { op: 'MESSAGE_REACTION_PUSH', count: 1 },
          { op: 'MESSAGE_REACTION_PULL', count: 1 }
        ]
        const missingOps = expectedOps.filter(item => item.count > ops.filter(op => op.includes(item.op)).length)
        console.log(`WS1: ${ops}`)
        console.log(`WS1 missing: ${JSON.stringify(missingOps)}`)
        if (missingOps.length === 0) {
        // WAIT A BIT...
          setTimeout(() => {
            ws1.terminate()
            resolve()
          }, 1000)
        }
      })
    })
    const cookie2 = { headers: { cookie: `token=${user2.token}` } }
    ws2 = new WebSocket(`ws://localhost:${port}`, cookie2)
    await waitABit()
    const p2 = new Promise((resolve) => {
      const ops = []
      ws2.on('ping', () => {
        console.log('PING2')
      })
      ws2.on('message', (message) => {
        const msg = JSON.parse(message)
        ops.push(msg.op)

        const expectedOps = [
          { op: 'ROOM_CREATE', count: 1 },
          { op: 'ROOM_UPDATE', count: 1 },
          { op: 'ROOM_DELETE', count: 1 },
          { op: 'ROOM_INVITE_ACCEPT', count: 1 },
          { op: 'MESSAGE_CREATE', count: 2 },
          { op: 'ROOM_CALL_OPEN', count: 1 },
          { op: 'ROOM_CALL_CLOSE', count: 1 },
          { op: 'CONNECTION_CLOSE', count: 1 }
        ]
        const missingOps = expectedOps.filter(item => item.count > ops.filter(op => item.op === op).length)
        console.log(`WS2: ${ops}`)
        console.log(`WS2 missing: ${JSON.stringify(missingOps)}`)
        if (missingOps.length === 0) {
        // WAIT A BIT...
          setTimeout(() => {
            ws2.terminate()
            resolve()
          }, 1000)
        }
      })
    })
    const cookie3 = { headers: { cookie: `token=${user3.token}` } }
    ws3 = new WebSocket(`ws://localhost:${port}`, cookie3)
    await waitABit()
    const p3 = new Promise((resolve) => {
      const ops = []
      ws3.on('ping', () => {
        console.log('PING3')
      })
      ws3.on('message', async (message) => {
        const msg = JSON.parse(message)
        if (msg.op.includes('MESSAGE_CREATE') &&
      ops.filter(op => op.includes('MESSAGE_CREATE')).length === 0) {
          messageOps.createWs(ws1, 'MESSAGE_REACTION_PUSH', {
            id: msg.data[0]._id,
            data: data.room1.reactions.reaction1
          })
          await waitABit()
          messageOps.createWs(ws1, 'MESSAGE_REACTION_PULL', {
            id: msg.data[0]._id,
            data: {}
          })
          await waitABit()
        }
        if (msg.op.includes('MESSAGE_REACTION_PULL') &&
      ops.filter(op => op.includes('MESSAGE_REACTION_PULL')).length === 0) {
          messageOps.createWs(ws1, 'MESSAGE_UPDATE', {
            id: msg.data[0]._id,
            update: { content: data.room2.messages.message2Update.content }
          })
        }
        ops.push(msg.op)
        const expectedOps = [
          { op: 'ROOM_PEER_ADD', count: 1 },
          { op: 'ROOM_CREATE', count: 1 },
          { op: 'ROOM_UPDATE', count: 1 },
          { op: 'MESSAGE_CREATE', count: 1 },
          { op: 'MESSAGE_UPDATE', count: 1 },
          { op: 'MESSAGE_REACTION_PUSH', count: 1 },
          { op: 'MESSAGE_REACTION_PULL', count: 1 }
        ]
        const missingOps = expectedOps.filter(item => item.count > ops.filter(op => op.includes(item.op)).length)
        console.log(`WS3: ${ops}`)
        console.log(`WS3 missing: ${JSON.stringify(missingOps)}`)
        if (missingOps.length === 0) {
        // WAIT A BIT...
          setTimeout(() => {
            ws3.terminate()
            resolve()
          }, 1000)
        }
      })
    })

    const cookie4 = { headers: { cookie: `token=${user4.token}` } }
    ws4 = new WebSocket(`ws://localhost:${port}`, cookie4)
    await waitABit()
    const p4 = new Promise((resolve) => {
      const ops = []
      ws4.on('ping', () => {
        console.log('PING4')
      })
      ws4.on('message', (message) => {
        const msg = JSON.parse(message)
        ops.push(msg.op)
        const expectedOps = [
          { op: 'ROOM_INVITE_ACCEPT', count: 1 },
          { op: 'MESSAGE_CREATE', count: 2 },
          { op: 'ROOM_UPDATE', count: 1 },
          { op: 'ROOM_CALL_OPEN', count: 1 },
          { op: 'ROOM_CALL_CLOSE', count: 1 },
          { op: 'ROOM_DELETE', count: 1 }
        ]
        const missingOps = expectedOps.filter(item => item.count > ops.filter(op => op.includes(item.op)).length)
        console.log(`WS4: ${ops}`)
        console.log(`WS4 missing: ${JSON.stringify(missingOps)}`)
        if (missingOps.length === 0) {
        // WAIT A BIT...
          setTimeout(() => {
            ws4.terminate()
            resolve()
          }, 1000)
        }
      })
    })

    await waitABit()
    await roomOps.createApi(fastify, user1.token, room1.payload)
      .then((response) => {
        const result = JSON.parse(response.payload)
        room1.record = result
      })
    await waitABit()
    await roomOps.pushApi(fastify, user1.token, room1.record._id, 'moderator', {
      user: user2.record._id
    })
    await waitABit()
    await roomOps.pushApi(fastify, user1.token, room1.record._id, 'member', {
      user: user3.record._id
    })
    await waitABit()
    await roomOps.createApi(fastify, user2.token, room2.payload)
      .then((response) => {
        const result = JSON.parse(response.payload)
        room2.record = result
      })
    await waitABit()
    await roomOps.pushApi(fastify, user2.token, room2.record._id, 'moderator', {
      user: user1.record._id
    })
    await waitABit()
    data.user.user4.invite.room = room2.record._id
    let invites = []
    await inviteOps.createApi(fastify, user2.token, [data.user.user4.invite])
      .then((response) => {
        invites = JSON.parse(response.payload)
      })
    await waitABit()
    await inviteOps.acceptApi(fastify, user4.token, invites[0]._id)
    await waitABit(50)
    await roomOps.updateApi(fastify, user2.token, room1.record._id, room1.update)
    await waitABit()
    data.room1.messages.message1.client_id = uuid()
    messageOps.createWs(ws1, 'MESSAGE_CREATE', {
      room: room1.record._id,
      message: [data.room1.messages.message1]
    })
    await waitABit()
    data.room2.messages.message2.client_id = uuid()
    messageOps.createWs(ws2, 'MESSAGE_CREATE', {
      room: room2.record._id,
      message: [data.room2.messages.message2]
    })
    await waitABit()
    data.room2.messages.message2.client_id = uuid()
    messageOps.createWs(ws4, 'MESSAGE_CREATE', {
      room: room2.record._id,
      message: [data.room2.messages.message2]
    })
    await waitABit()
    const callId1 = uuid()
    messageOps.createWs(ws2, 'ROOM_CALL_OPEN', {
      room: room2.record._id,
      call_id: callId1
    })
    await waitABit()
    const callId2 = uuid()
    messageOps.createWs(ws4, 'ROOM_CALL_OPEN', {
      room: room2.record._id,
      call_id: callId2
    })
    await waitABit(50)
    await callOps.getAllApi(fastify, user4.token)
      .then((response) => {
        const result = JSON.parse(response.payload)
        t.true(Array.isArray(result))
        t.true(result.length === 2)
      })
    await waitABit()
    messageOps.createWs(ws4, 'ROOM_CALL_CLOSE', {
      id: callId2
    })
    await waitABit()
    callOps.pullApi(fastify, user1.token, callId1)
    await waitABit()
    await callOps.getAllApi(fastify, user2.token)
      .then((response) => {
        const result = JSON.parse(response.payload)
        t.true(Array.isArray(result))
        t.true(result.length === 0)
      })
    await waitABit()
    await roomOps.deleteApi(fastify, user2.token, room2.record._id)
    await waitABit()

    await Promise.all([p1, p2, p3, p4])
    t.pass()
  })

  test.after('Shutdown API server', (t) => {
    fastify.close().then(() => {
      console.log('Fastify successfully closed!')
      process.exit(0)
    }, (err) => {
      console.log('Closing Fastify: an error happened', err)
    })
  })
}
run()
