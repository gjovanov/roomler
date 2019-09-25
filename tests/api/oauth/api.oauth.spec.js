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
const oauthFacebook1 = new OAuthContext(data.oauth1.facebook, 'facebook')
const oauthFacebook1After = new OAuthContext(data.oauth1.facebook, 'facebook', user1)

const user2 = new UserContext(data.user2)
const oauthFacebook2 = new OAuthContext(data.oauth2.facebook, 'facebook', user2)

const oauthFacebook3 = new OAuthContext(data.oauth3.facebook, 'facebook')
const user3 = new UserContext(data.user3, null, oauthFacebook3)
const oauthFacebook3After = new OAuthContext(data.oauth3.facebook, 'facebook', user3)

const oauthInvalid = new OAuthContext(data.oauthInvalid.facebook, 'facebook')
const oauthUnsupportedType = new OAuthContext(data.oauth1.facebook, 'facebook')

const run = async () => {
  await server.up(port)
  fastify = server.fastify

  oAuthOps.getOrCreate(fastify, test, 'create facebook oauth oauthFacebook1 without existing user having same email', oauthFacebook1)
  authOps.register(fastify, test, 'register the user1 with existing oauth oauthFacebook1 having same email', user1)
  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth oauthFacebook1 linked with user1', oauthFacebook1After)

  authOps.register(fastify, test, 'register the user2 without existing oauth having same email', user2)
  oAuthOps.getOrCreate(fastify, test, 'create facebook oauth oauthFacebook2 with existing user2 having same email', oauthFacebook2)

  oAuthOps.getOrCreate(fastify, test, 'create facebook oauth oauthFacebook3 without existing user having same email', oauthFacebook3)
  authOps.register(fastify, test, 'register the user3 with oauthId=oauthFacebook3', user3)
  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth oauthFacebook3 linked with user3', oauthFacebook3After)

  oAuthOps.getOrCreateMissingEmail(fastify, test, 'create facebook oauth with missing email address should fail', oauthInvalid)
  oAuthOps.getOrCreateUnsupportedType(fastify, test, 'create oauth of unsupported type should fail', oauthUnsupportedType)

  oAuthOps.getAll(fastify, test, 'get all oauths for user1', [oauthFacebook1After])
  oAuthOps.update(fastify, test, 'update facebook oauth oauthFacebook1', oauthFacebook1After)
  oAuthOps.updateInvalidId(fastify, test, 'update facebook oauth oauthFacebook1 with invalidId fails', user1, data.invalidId)
  oAuthOps.delete(fastify, test, 'delete facebook oauth oauthFacebook1', oauthFacebook1After)
  oAuthOps.delete(fastify, test, 'delete facebook oauth oauthFacebook2', oauthFacebook2)
  oAuthOps.delete(fastify, test, 'delete facebook oauth oauthFacebook3', oauthFacebook3After)
  oAuthOps.updateNotFoundId(fastify, test, 'update deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1After)
  oAuthOps.deleteInvalidId(fastify, test, 'delete facebook oauth oauthFacebook1 with invalidId should fail', user1, data.invalidId)
  oAuthOps.deleteNotFoundId(fastify, test, 'delete already deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1After)

  authOps.delete(fastify, test, 'delete the user1 for oauth testing', user1)
  authOps.delete(fastify, test, 'delete the user2 for oauth testing', user2)
  authOps.delete(fastify, test, 'delete the user3 for oauth testing', user3)

  test.after('Shutdown API server', async (t) => {
    await server.down()
  })
}
run()
// nock.disableNetConnect()
