const passwordResetType = 'password_reset'

class AuthOps {
  register(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/register" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/register`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload: userContext.payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.token)
          t.true(!!result.user)
          t.true(!!result.user._id)
          t.true(result.user.username === userContext.payload.username)
          t.true(result.user.email === userContext.payload.email)
          t.true(!result.user.password)
          t.true(!result.user.is_active)
          userContext.record = result.user
          userContext.token = result.token
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  activate(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/activate" ${testname}`, async(t) => {
      userContext.code = await require('../../../api/services/code/code-service').get(userContext.payload.username)
      const payload = {
        username: userContext.payload.username,
        token: userContext.code.token
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
          t.true(!!result.token)
          t.true(!!result.user)
          t.true(!!result.user._id)
          t.true(result.user.username === userContext.payload.username)
          t.true(result.user.email === userContext.payload.email)
          t.true(!result.user.password)
          t.true(result.user.is_active)
          userContext.record = result.user
          userContext.token = result.token
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  activateInvalidUsername(fastify, test, testname, invalidUsername) {
    test.serial(`API "/api/auth/activate" ${testname}`, async(t) => {
      const payload = {
        username: invalidUsername,
        token: 'invalid_token'
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
          t.is(response.statusCode, 409)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.errors))
          t.true(result.errors.length > 0)
          t.true(result.errors[0].prop === 'username')
          t.true(result.errors[0].message === 'User doesn\'t exist.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  activateInvalidToken(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/activate" ${testname}`, async(t) => {
      const payload = {
        username: userContext.payload.username,
        token: 'invalid_token'
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
          t.is(response.statusCode, 409)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.errors))
          t.true(result.errors.length > 0)
          t.true(result.errors[0].prop === 'code')
          t.true(result.errors[0].message === 'Invalid or expired activation code.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  loginInvalidPassword(fastify, test, testname, userContext, invalidPassword) {
    test.serial(`API "/api/auth/login" ${testname}`, async(t) => {
      const payload = {
        username: userContext.payload.username,
        password: invalidPassword
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/login`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 409)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.errors))
          t.true(result.errors.length > 0)
          t.true(result.errors[0].prop === 'password')
          t.true(result.errors[0].message === 'Passwords don\'t match.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  login(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/login" ${testname}`, async(t) => {
      const payload = {
        username: userContext.payload.username,
        password: userContext.payload.password
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/login`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.token)
          t.true(!!result.user)
          t.true(!!result.user._id)
          t.true(result.user.username === userContext.payload.username)
          t.true(result.user.email === userContext.payload.email)
          t.true(!result.user.password)
          t.true(result.user.is_active)
          userContext.record = result.user
          userContext.token = result.token
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  reset(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/reset" ${testname}`, async(t) => {
      const payload = {
        username: userContext.payload.username,
        type: passwordResetType
      }
      await fastify
        .inject({
          method: 'POST',
          url: `/api/auth/reset`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.result === 'ok')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updatePasswordPasswordsMismatch(fastify, test, testname, userContext, mismatchPassword) {
    test.serial(`API "/api/auth/password/update" ${testname}`, async(t) => {
      const code = await require('../../../api/services/code/code-service').get(userContext.payload.username, passwordResetType)
      const payload = {
        username: userContext.payload.username,
        token: code.token,
        password: userContext.update.password,
        passwordConfirm: mismatchPassword
      }
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/auth/password/update`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 409)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.errors))
          t.true(result.errors.length > 0)
          t.true(result.errors[0].prop === 'password')
          t.true(result.errors[0].message === 'Passwords don\'t match.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updatePassword(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/password/update" ${testname}`, async(t) => {
      const code = await require('../../../api/services/code/code-service').get(userContext.payload.username, passwordResetType)
      const payload = {
        username: userContext.payload.username,
        token: code.token,
        password: userContext.update.password,
        passwordConfirm: userContext.update.password
      }
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/auth/password/update`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.token)
          t.true(!!result.user)
          t.true(!!result.user._id)
          t.true(result.user.username === userContext.payload.username)
          t.true(result.user.email === userContext.payload.email)
          t.true(!result.user.password)
          t.true(result.user.is_active)
          userContext.record = result.user
          userContext.token = result.token
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updatePerson(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/person/update" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/auth/person/update`,
          headers: {
            'Content-Type': 'application/json'
          },
          payload: userContext.person.payload,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.firstname === userContext.person.payload.firstname)
          t.true(result.lastname === userContext.person.payload.lastname)
          t.true(result.imageUrl === userContext.person.payload.imageUrl)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  me(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/me" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/auth/me`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.user)
          t.true(!!result.token)
          t.true(!!result.person)
          t.true(!!result.user._id)
          t.true(result.user.username === userContext.payload.username)
          t.true(result.user.email === userContext.payload.email)
          t.true(!result.user.password)
          t.true(result.user.is_active)
          t.true(result.person.firstname === userContext.person.payload.firstname)
          t.true(result.person.lastname === userContext.person.payload.lastname)
          t.true(result.person.imageUrl === userContext.person.payload.imageUrl)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/delete" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/auth/delete`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
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

  meInvalidToken(fastify, test, testname, userContext) {
    test.serial(`API "/api/auth/me" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'GET',
          url: `/api/auth/me`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 409)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result.errors))
          t.true(result.errors.length > 0)
          t.true(result.errors[0].prop === 'token')
          t.true(result.errors[0].message === 'Invalid authentication token.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

}

module.exports = new AuthOps()
