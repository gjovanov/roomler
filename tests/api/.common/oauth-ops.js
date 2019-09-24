const nock = require('nock')
const facebookOptions = require('../../../api/plugins/facebook-options')
const getOptions = (type) => {
  if (type === 'facebook') {
    return facebookOptions
  }
}
const TOKEN_RESPONSE = {
  access_token: 'my-access-token',
  refresh_token: 'my-refresh-token',
  token_type: 'bearer',
  expires_in: '240000'
}
const TOKEN_RESPONSE_REFRESHED = {
  access_token: 'my-access-token-refreshed',
  refresh_token: 'my-refresh-token-refreshed',
  token_type: 'bearer',
  expires_in: '240000'
}

class OAuthOps {
  getOrCreate(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/get-or-create" ${testname}`, async(t) => {
      // clean reinit all MOCKS
      nock.cleanAll()
      const options = getOptions(oauthContext.type)
      const tokenQuerystring = `code=my-code&redirect_uri=${encodeURIComponent(options.callbackUri)}&grant_type=authorization_code&client_id=${options.credentials.client.id}&client_secret=${options.credentials.client.secret}`
      const tokenRefreshQuerystring = `grant_type=refresh_token&refresh_token=my-refresh-token&client_id=${options.credentials.client.id}&client_secret=${options.credentials.client.secret}`
      const tokenMock = nock(options.credentials.auth.tokenHost)
        // .log(console.log)
        .persist()
        .post(options.credentials.auth.tokenPath, tokenQuerystring)
        .reply(200, TOKEN_RESPONSE)
        .post(options.credentials.auth.tokenPath, tokenRefreshQuerystring)
        .reply(200, TOKEN_RESPONSE_REFRESHED)
      const meMock = nock(options.credentials.auth.tokenHost, {
          reqheaders: {
            Authorization: 'Bearer my-access-token'
          }
        })
        // .log(console.log)
        .persist()
        .get('/v4.0/me')
        .query({
          fields: 'email,name,picture.type(large)'
        })
        .reply(200, oauthContext.me)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-or-create?type=${oauthContext.type}&code=my-code&state=${options.generateStateFunction()}`,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.oauth)
          if (oauthContext.user) {
            t.true(!!result.user)
            t.true(!!result.token)
          }
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getAll(fastify, test, testname, oauthContexts) {
    test.serial(`API "/api/oauth/get-all" ${testname}`, async(t) => {
      const expectedMessages = oauthContexts.map(mc => mc.records).reduce((a, b) => [...a, ...b])
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-all?room=${oauthContexts[0].records[0].room._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauthContexts[0].token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(Array.isArray(result))
          expectedMessages.forEach(expectedMessage => {
            const message = result.find(m => m._id.toString() === expectedMessage._id.toString())
            t.true(!!message)
            t.true(!!expectedMessage._id)
            t.true(expectedMessage.room._id.toString() === oauthContexts[0].records[0].room._id.toString())
            if (message.type) {
              t.true(expectedMessage.type === message.type)
            }
            t.true(expectedMessage.content === message.content)
            if (message.mentions) {
              message.mentions.forEach(mention => {
                const foundMention = expectedMessage.mentions.find(item => item._id.toString() === mention._id.toString())
                t.true(!!foundMention)
              })
            }
            t.true(!!expectedMessage.createdAt)
            t.true(!!expectedMessage.updatedAt)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  update(fastify, test, testname, messageContext) {
    test.serial(`API "/api/oauth/update/:id" ${testname}`, async(t) => {
      const payload = messageContext.update
      payload.mentions = messageContext.getMentionIds(payload)
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/oauth/update/${messageContext.records[0]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.room._id.toString() === messageContext.room._id.toString())
          if (payload.type) {
            t.true(result.type === payload.type)
          }
          t.true(result.content === payload.content)
          if (payload.mentions) {
            payload.mentions.forEach(mention => {
              const foundMention = result.mentions.find(item => item._id.toString() === mention.toString())
              t.true(!!foundMention)
            })
          }
          t.true(!!result.createdAt)
          t.true(!!result.updatedAt)
          messageContext.records = messageContext.records.map(r => r._id.toString() === result._id.toString() ? result : r)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  updateInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/oauth/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/oauth/update/${invalidId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === 'Invalid message id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  updateNotFoundId(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/oauth/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/oauth/update/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Message was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/oauth/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/oauth/delete/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
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
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteInvalidId(fastify, test, testname, userContext, invalidId) {
    test.serial(`API "/api/oauth/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/oauth/delete/${invalidId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === 'Invalid message id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, messageContext, recordIndex) {
    test.serial(`API "/api/oauth/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/oauth/delete/${messageContext.records[recordIndex]._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${messageContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'Message was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new OAuthOps()
