import test from 'ava'
let fastify = null
const server = require('../../../server/api/api-server')
const port = 5001
const authOps = require('../.common/auth-ops')
const oAuthOps = require('../.common/oauth-ops')
const UserContext = require('../.context/user-context')
const OAuthContext = require('../.context/oauth-context')
const data = require('./data')

const user1 = new UserContext(data.user1)
const oauthFacebook1 = new OAuthContext(data.oauth1.facebook, 'facebook', user1)

const oauthInvalid = new OAuthContext(data.oauthInvalid.facebook, 'facebook')
const oauthUnsupportedType = new OAuthContext(data.oauth1.facebook, 'facebook')

const run = async () => {
  await server.up(port)
  fastify = server.fastify

  oAuthOps.getOrCreate(fastify, test, 'create facebook oauth oauthFacebook1 should create user1 and return token', oauthFacebook1)
  authOps.me(fastify, test, 'get user1 info', user1)
  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth oauthFacebook1 should return existing oauth, user and token', oauthFacebook1)

  oAuthOps.getOrCreateMissingEmail(fastify, test, 'create facebook oauth with missing email address should fail', oauthInvalid)
  oAuthOps.getOrCreateUnsupportedType(fastify, test, 'create oauth of unsupported type should fail', oauthUnsupportedType)

  oAuthOps.getAll(fastify, test, 'get all oauths for user1', [oauthFacebook1])
  oAuthOps.update(fastify, test, 'update facebook oauth oauthFacebook1', oauthFacebook1)
  oAuthOps.updateInvalidId(fastify, test, 'update facebook oauth oauthFacebook1 with invalidId fails', user1, data.invalidId)
  oAuthOps.delete(fastify, test, 'delete facebook oauth oauthFacebook1', oauthFacebook1)
  oAuthOps.updateNotFoundId(fastify, test, 'update deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1)
  oAuthOps.deleteInvalidId(fastify, test, 'delete facebook oauth oauthFacebook1 with invalidId should fail', user1, data.invalidId)
  oAuthOps.deleteNotFoundId(fastify, test, 'delete already deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1)

  authOps.delete(fastify, test, 'delete the user1 for oauth testing', user1)

  test.after('Shutdown API server', async (t) => {
    await server.down()
  })
}
run()
// nock.disableNetConnect()
