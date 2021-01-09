const nock = require('nock')
// const facebookOptions = require('../../api/plugins/oauth/facebook-options')
// const googleOptions = require('../../api/plugins/oauth/google-options')
// const githubOptions = require('../../api/plugins/oauth/github-options')
// const linkedinOptions = require('../../api/plugins/oauth/linkedin-options')

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
const getOptions = (fastify, type) => {
  return fastify.oauthOptions[type]
}
const setMocks = (fastify, nock, oauthContext) => {
  // clean reinit all MOCKS
  nock.cleanAll()
  const options = getOptions(fastify, oauthContext.type)
  const state = options.generateStateFunction()
  const tokenBody = {
    code: 'my-code',
    redirect_uri: options.callbackUri,
    grant_type: 'authorization_code'
  }  
  const tokenRefreshBody = {
    refresh_token: 'my-refresh-token',
    grant_type: 'refresh_token'
  }
  if (oauthContext.type === 'linkedin') {
    tokenBody.client_id = options.credentials.client.id || ''
    tokenBody.client_secret = options.credentials.client.secret || ''

    tokenRefreshBody.client_id = options.credentials.client.id || ''
    tokenRefreshBody.client_secret = options.credentials.client.secret || ''
  }


  const headers = oauthContext.type === 'linkedin' ? {
    reqheaders: {
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded'
    }
  } : {
    reqheaders: {
      authorization: 'Basic bXktY2xpZW50LWlkOm15LXNlY3JldA=='
    }
  }


  const tokenMock = nock(options.credentials.auth.tokenHost)
    .persist()
    .post(options.credentials.auth.tokenPath, tokenBody, headers)
    .reply(200, TOKEN_RESPONSE)
    .post(options.credentials.auth.tokenPath, tokenRefreshBody, headers)
    .reply(200, TOKEN_RESPONSE_REFRESHED)

  if (oauthContext.type === 'facebook') {
    nock(options.credentials.auth.tokenHost, {
      reqheaders: {
        Authorization: 'Bearer my-access-token'
      }
    })
    .persist()
    .get('/v6.0/me')
    .query({
      fields: 'email,name,picture.type(large)'
    })
    .reply(200, oauthContext.me)
  } else if (oauthContext.type === 'google') {
    nock(options.credentials.auth.tokenHost, {
      reqheaders: {
        Authorization: 'Bearer my-access-token'
      }
    })
    .persist()
    .get('/userinfo/v2/me')
    .reply(200, oauthContext.me)
  } else if (oauthContext.type === 'github') {
    const me2 = Object.assign({}, oauthContext.me)
    delete me2.email
    nock('https://api.github.com', {
      reqheaders: {
        Authorization: 'token my-access-token',
        'User-Agent': 'Roomler APP'
      }
    })
    .persist()
    .get('/user')
    .reply(200, me2)

    nock('https://api.github.com', {
      reqheaders: {
        Authorization: 'token my-access-token',
        'User-Agent': 'Roomler APP'
      }
    })
    .persist()
    .get('/user/emails')
    .reply(200, oauthContext.email)
  } else {
    nock('https://api.linkedin.com', {
      reqheaders: {
        Authorization: 'Bearer my-access-token'
      }
    })
    .persist()
    .get('/v2/me')
    .query({
      projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
    })
    .reply(200, oauthContext.me)

    nock('https://api.linkedin.com', {
      reqheaders: {
        Authorization: 'Bearer my-access-token'
      }
    })
    .persist()
    .get('/v2/emailAddress')
    .query({
      q: 'members',
      projection: '(elements*(handle~))'
    })
    .reply(200, oauthContext.email)
  }
  
    
  return state
}



class OAuthOps {
  getOrCreate(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/get-or-create" ${testname}`, async(t) => {
      const state = setMocks(fastify, nock, oauthContext)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-or-create?type=${oauthContext.type}&code=my-code&state=${state}`,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result.oauth)
          t.true(!!result.oauth._id)
          t.true(result.oauth.email === oauthContext.me.email)
          t.true(result.oauth.name === oauthContext.me.name)
          t.true(!!result.user)
          t.true(result.user.email === oauthContext.me.email)
          t.true(!!result.token)
          oauthContext.record = result.oauth
          oauthContext.user.record = result.user
          oauthContext.user.token = result.token
          oauthContext.user.payload.username = result.user.username
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getOrCreateMissingEmail(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/get-or-create" ${testname}`, async(t) => {
      const state = setMocks(fastify, nock, oauthContext)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-or-create?type=${oauthContext.type}&code=my-code&state=${state}`,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === `Email address is missing with '${oauthContext.type}' login. Try another option.`)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getOrCreateUnsupportedType(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/get-or-create" ${testname}`, async(t) => {
      const state = setMocks(fastify, nock, oauthContext)
      const typeOverride = 'unsupported'
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-or-create?type=${typeOverride}&code=my-code&state=${state}`,
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'TypeError')
          t.true(result.message === `Unsupported OAuth type: ${typeOverride}`)
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  getAll(fastify, test, testname, oauthContexts) {
    test.serial(`API "/api/oauth/get-all" ${testname}`, async(t) => {
      const expectedOAuths = oauthContexts.map(mc => mc.record)
      await fastify
        .inject({
          method: 'GET',
          url: `/api/oauth/get-all`,
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

          expectedOAuths.forEach(expectedOAuth => {
            const oauth = result.find(m => m._id.toString() === expectedOAuth._id.toString())
            t.true(!!oauth._id)
            t.true(oauth.email === expectedOAuth.email)
            t.true(oauth.name === expectedOAuth.name)
          })

          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  update(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/update/:id" ${testname}`, async(t) => {
      const payload = oauthContext.update
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/oauth/update/${oauthContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauthContext.token}`
          },
          payload
        })
        .then((response) => {
          t.is(response.statusCode, 200)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(!!result._id)
          t.true(result.email === oauthContext.update.email)
          t.true(result.name === oauthContext.update.name)
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
          t.true(result.message === 'Invalid oauth id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
  updateNotFoundId(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/update/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'PUT',
          url: `/api/oauth/update/${oauthContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauthContext.token}`
          },
          payload: {}
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'OAuth was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  delete(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/oauth/delete/${oauthContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauthContext.token}`
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
          t.true(result.message === 'Invalid oauth id!')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }

  deleteNotFoundId(fastify, test, testname, oauthContext) {
    test.serial(`API "/api/oauth/delete/:id" ${testname}`, async(t) => {
      await fastify
        .inject({
          method: 'DELETE',
          url: `/api/oauth/delete/${oauthContext.record._id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${oauthContext.token}`
          }
        })
        .then((response) => {
          t.is(response.statusCode, 500)
          t.is(response.headers['content-type'], 'application/json; charset=utf-8')
          const result = JSON.parse(response.payload)
          t.true(result.name === 'ReferenceError')
          t.true(result.message === 'OAuth was not found.')
          t.pass()
        })
        .catch((e) => {
          t.fail(e)
        })
    })
  }
}

module.exports = new OAuthOps()
