class PingOps {
  ping(fastify, test, testname) {
    test.serial(`API "/api/ping" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/ping`
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          t.deepEqual(JSON.parse(response.payload), {
            result: 'pong'
          })
          t.pass()
        })
        .catch((e) => {
          t.fail()
        })
    })
  }
}

module.exports = new PingOps()
