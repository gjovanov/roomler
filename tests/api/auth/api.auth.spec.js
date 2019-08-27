import test from 'ava'
const fastify = require('../../../api/api')()
const authOps = require('../.common/auth-ops')
const UserContext = require('../.context/user-context')
const data = require('./data')
const user = new UserContext(data.user)
const passwordResetType = 'password_reset'

authOps.register(fastify, test, 'returns auth token and user info', user)

test.serial('API "/api/auth/activate" throws ValidationError for invalid username', async (t) => {
  const payload = {
    username: 'unexistingusername',
    token: 'xxxxxxx'
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
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/activate" throws ValidationError for invalid token', async (t) => {
  const payload = {
    username: user.payload.username,
    token: 'xxxxxxx'
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
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/activate" returns auth token and user info', async (t) => {
  user.code = await require('../../../api/services/code/code-service').get(user.payload.username)
  const payload = {
    username: user.payload.username,
    token: user.code.token
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
      t.true(result.user.username === user.payload.username)
      t.true(result.user.email === user.payload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === true)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/login" throws ValidationError for no password maatch', async (t) => {
  const payload = {
    username: user.payload.username,
    password: '87654321'
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
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/login" returns auth token and user info', async (t) => {
  const payload = {
    username: user.payload.username,
    password: user.payload.password
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
      t.true(result.token !== undefined)
      t.true(result.user !== undefined)
      t.true(result.user._id !== undefined)
      t.true(result.user.username === user.payload.username)
      t.true(result.user.email === user.payload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === true)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/code/get" returns ok', async (t) => {
  const payload = {
    username: user.payload.username,
    type: passwordResetType
  }
  await fastify
    .inject({
      method: 'POST',
      url: `/api/auth/code/get`,
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
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/password/update" throws ValidationError no password matach', async (t) => {
  user.code = await require('../../../api/services/code/code-service').get(user.payload.username, passwordResetType)
  const payload = {
    username: user.payload.username,
    token: user.code.token,
    password: user.payload.password + '9',
    passwordConfirm: user.payload.passwordConfirm + '90'
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
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/password/update" returns auth token and user info', async (t) => {
  user.code = await require('../../../api/services/code/code-service').get(user.payload.username, passwordResetType)
  const payload = {
    username: user.payload.username,
    token: user.code.token,
    password: user.payload.password + '9',
    passwordConfirm: user.payload.passwordConfirm + '9'
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
      t.true(result.token !== undefined)
      t.true(result.user !== undefined)
      t.true(result.user._id !== undefined)
      t.true(result.user.username === user.payload.username)
      t.true(result.user.email === user.payload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === true)
      user.token = result.token
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/person/update" returns updated person', async (t) => {
  await fastify
    .inject({
      method: 'PUT',
      url: `/api/auth/person/update`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      payload: data.person.payload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.firstname === data.person.payload.firstname)
      t.true(result.lastname === data.person.payload.lastname)
      t.true(result.imageUrl === data.person.payload.imageUrl)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/me" returns user and person info ', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/auth/me`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.user !== undefined)
      t.true(result.person !== undefined)
      t.true(result.user._id !== undefined)
      t.true(result.user.username === user.payload.username)
      t.true(result.user.email === user.payload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === true)
      t.true(result.person.firstname === data.person.payload.firstname)
      t.true(result.person.lastname === data.person.payload.lastname)
      t.true(result.person.imageUrl === data.person.payload.imageUrl)
      t.pass()
    })
    .catch((e) => {
      t.fail()
    })
})

test.serial('API "/api/auth/delete" deletes authenciated use r', async (t) => {
  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/auth/delete`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
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
      t.fail()
    })
})

test.serial('API "/api/auth/me" throws a ValidationError for a token of deleted user', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/auth/me`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
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
      t.fail()
    })
})

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
