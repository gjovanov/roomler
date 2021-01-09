const test = require('ava')
let fastify = null

const run = async () => {
  fastify = await require('roomler.api')()

  test.serial('API "/api/config/get"', async (t) => {
    await fastify
      .inject({
        method: 'GET',
        url: '/api/config/get',
        headers: {
          'Content-Type': 'application/json'
        },
        payload: {}
      })
      .then((response) => {
        t.is(response.statusCode, 200)
        t.is(response.headers['content-type'], 'application/json; charset=utf-8')
        const result = JSON.parse(response.payload)
        t.true(!!result.appSettings)
        t.true(!!result.janusSettings)
        t.true(!!result.authSettings)
        t.true(!!result.oauthSettings)
        t.true(!!result.dbSettings)
        t.true(!!result.dataSettings)
        t.true(!!result.wsSettings)
        t.true(!!result.emailSettings)
        t.pass()
      })
      .catch((e) => {
        t.fail(e)
      })
  })

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}
run()
