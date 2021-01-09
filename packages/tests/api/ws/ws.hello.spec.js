
const test = require('ava')
const consola = require('consola')
const WebSocket = require('ws')
let fastify = null
const port = 6001
let ws

const run = async () => {
  try {
    fastify = await require('roomler.api')()
    const address = await fastify.listen(port)
    consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }

  test.serial(`API "op='HELLO'" ${'testname'}`, async (t) => {
    ws = new WebSocket(`ws://localhost:${port}`)
    await new Promise((resolve, reject) => {
      ws.on('message', (message) => {
        const data = JSON.parse(message)
        t.true(data && data.op && data.op.includes('HELLO'))
        resolve()
      })
    })
  })

  test.after('Shutdown API server', async (t) => {
    ws.close()
    const p = new Promise((resolve, reject) => {
      setTimeout(async () => {
        await fastify.close()
        resolve()
      }, 1000)
    })
    await p
  })
}

run()
