const fastify = require('../../../api/api')()
const test = require('ava')
const consola = require('consola')
const WebSocket = require('ws')
const port = 6001
let ws

test.before('Start API server', async (t) => {
  try {
    const address = await fastify.listen(port)
    consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }
})
test.serial(`API "op='HELLO'" ${'testname'}`, async (t) => {
  ws = new WebSocket(`ws://localhost:${port}`)
  await new Promise((resolve, reject) => {
    ws.on('message', (message) => {
      const data = JSON.parse(message)
      console.log(data)
      t.true(data && data.op && data.op.includes('HELLO'))
      resolve()
    })
  })
  //   client.once('data', (chunk) => {
  //     t.true(chunk === 'hello')
  //     client.end()
  //     t.pass()
  //   })
})

test.after('Shutdown API server', async (t) => {
  ws.close()
  await fastify.close()
})
