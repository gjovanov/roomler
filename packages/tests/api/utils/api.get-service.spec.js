const test = require('ava')
const consola = require('consola')
const port = 6101
let fastify = null

const run = async () => {
  try {
    fastify = await require('roomler.api')()
    const address = await fastify.listen(port)
    consola.success(`API SERVER '${`${require('os').hostname()}_${require('process').pid}`}' is listening at: ${address}`)
  } catch (err) {
    consola.error(err)
    process.exit(1)
  }

  const getService = require('roomler.api/services/utils/get-service')

  test.serial('API "get-service success"', async (t) => {
    const data = await getService.get({
      url: `http://localhost:${port}/api/ping`,
      method: 'GET',
      json: true
    })
    t.true(data.result === 'pong')
    t.pass()
  })

  test.serial('API "get-service error"', async (t) => {
    try {
      await getService.get({
        url: `http://localhost1:${port}/api/ping`,
        method: 'GET',
        json: true
      })
      t.fail('Reached unxpected reply')
    } catch (e) {
      t.true(!!e)
      t.pass()
    }
  })

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}
run()
