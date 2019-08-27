import test from 'ava'
const fastify = require('../../../api/api')()

let user = null
let token = null
let code = null
let email = null

const invalidEmailId = 'axlskj'

const registerPayload = {
  username: 'emailuser',
  email: 'emailuser@gmail.com',
  password: '12345678',
  passwordConfirm: '12345678'
}
const emailByTemplatePayload = {
  type: 'template',
  to: 'emailuser@gmail.com',
  subject: 'Account was successfully activated',
  template: 'user-activation-success.hbs',
  model: {
    name: 'testuser',
    platform: 'Our super duper platform'
  }
}

const emailDirectPayload = {
  type: 'direct',
  to: 'emailuser@gmail.com',
  subject: 'Account was successfully activated',
  body: '<h1>Hello world!</h1>'
}

test.serial('API "/api/auth/register" prepares the user account for email creation', async (t) => {
  await fastify
    .inject({
      method: 'POST',
      url: `/api/auth/register`,
      headers: {
        'Content-Type': 'application/json'
      },
      payload: registerPayload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.token !== undefined)
      t.true(result.user !== undefined)
      t.true(result.user._id !== undefined)
      t.true(result.user.username === registerPayload.username)
      t.true(result.user.email === registerPayload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === false)
      user = result.user
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/activate" activates the user account for email creation', async (t) => {
  code = await require('../../../api/services/code/code-service').get(user.username)
  const payload = {
    username: registerPayload.username,
    token: code.token
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
      t.true(result.user.username === registerPayload.username)
      t.true(result.user.email === registerPayload.email)
      t.true(result.user.password === undefined)
      t.true(result.user.isactive === true)
      token = result.token
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/send" returns newly sent email by template', async (t) => {
  await fastify
    .inject({
      method: 'POST',
      url: `/api/email/send`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      payload: emailByTemplatePayload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.from !== undefined)
      t.true(result.to !== undefined)
      t.true(result.subject !== undefined)
      t.true(result.body !== undefined)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      email = result
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/send" returns newly sent direct email', async (t) => {
  await fastify
    .inject({
      method: 'POST',
      url: `/api/email/send`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      payload: emailDirectPayload
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.from !== undefined)
      t.true(result.to !== undefined)
      t.true(result.subject !== undefined)
      t.true(result.body !== undefined)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      email = result
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/get" returns email by id', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/email/get?id=${email._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result._id !== undefined)
      t.true(result.from !== undefined)
      t.true(result.to !== undefined)
      t.true(result.subject !== undefined)
      t.true(result.body !== undefined)
      t.true(result.createdAt !== undefined)
      t.true(result.updatedAt !== undefined)
      email = result
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/get-all" returns an email list', async (t) => {
  await fastify
    .inject({
      method: 'GET',
      url: `/api/email/get-all`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(Array.isArray(result))
      const first = result[0]
      t.true(first._id !== undefined)
      t.true(first.from !== undefined)
      t.true(first.to !== undefined)
      t.true(first.subject !== undefined)
      t.true(first.body !== undefined)
      t.true(first.createdAt !== undefined)
      t.true(first.updatedAt !== undefined)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/delete/:id" deletes a Email by id', async (t) => {
  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/email/delete/${email._id}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 200)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.ok === 1)
      t.true(result.n > 0)
      t.true(result.deletedCount > 0)
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/email/delete/:id" with invalid id throws a TypeError', async (t) => {
  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/email/delete/${invalidEmailId}`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      t.is(response.statusCode, 500)
      t.is(response.headers['content-type'], 'application/json; charset=utf-8')
      const result = JSON.parse(response.payload)
      t.true(result.name === 'TypeError')
      t.true(result.message === 'Invalid email id!')
      t.pass()
    })
    .catch(() => {
      t.fail()
    })
})

test.serial('API "/api/auth/delete" the email user', async (t) => {
  await fastify
    .inject({
      method: 'DELETE',
      url: `/api/auth/delete`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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

test.after('Shutdown API server', async (t) => {
  await fastify.close()
})
