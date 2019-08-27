class AuthOps {
  register(fastify, test, testname, context) {
    test.serial(`API "/api/auth/register" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/register`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload: context.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.token !== undefined)
          t.true(result.user !== undefined)
          t.true(result.user._id !== undefined)
          t.true(result.user.username === context.payload.username)
          t.true(result.user.email === context.payload.email)
          t.true(result.user.password === undefined)
          t.true(result.user.isactive === false)
          context.record = result.user
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  activate(fastify, test, testname, context) {
    test.serial(`API "/api/auth/register" ${testname}`, async(t) => {
      context.code = await require('../../../api/services/code/code-service').get(context.payload.username)
      const payload = {
        username: context.payload.username,
        token: context.code.token
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/activate`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.token !== undefined)
          t.true(result.user !== undefined)
          t.true(result.user._id !== undefined)
          t.true(result.user.username === context.payload.username)
          t.true(result.user.email === context.payload.email)
          t.true(result.user.password === undefined)
          t.true(result.user.isactive === true)
          context.token = result.token
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, context) {
    test.serial(`API "/api/auth/delete" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/auth/delete`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${context.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const payload = JSON.parse(response.payload)
          t.true(payload.ok === 1)
          t.true(payload.n > 0)
          t.true(payload.deletedCount > 0)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

}

module.exports = new AuthOps()
