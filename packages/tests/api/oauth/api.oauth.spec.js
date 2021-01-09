const test = require('ava')
let fastify = null
const authOps = require('../.common/auth-ops')
const oAuthOps = require('../.common/oauth-ops')
const UserContext = require('../.context/user-context')
const OAuthContext = require('../.context/oauth-context')
const data = require('./data')

const user1 = new UserContext(data.user1)
const oauthFacebook1 = new OAuthContext(data.oauth1.facebook, 'facebook', user1)
const oauthGoogle1 = new OAuthContext(data.oauth1.google, 'google', user1)
const oauthGithub1 = new OAuthContext(data.oauth1.github, 'github', user1)
const oauthLinkedIn1 = new OAuthContext(data.oauth1.linkedin, 'linkedin', user1)

const oauthInvalid = new OAuthContext(data.oauthInvalid.facebook, 'facebook')
const oauthUnsupportedType = new OAuthContext(data.oauth1.facebook, 'facebook')

const run = async () => {
  fastify = await require('roomler.api')()

  oAuthOps.getOrCreate(fastify, test, 'create facebook oauth oauthFacebook1 should create user1 and return token', oauthFacebook1)
  authOps.me(fastify, test, 'get user1 info', user1)
  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth oauthFacebook1 should return existing oauth, user and token', oauthFacebook1)
  oAuthOps.getOrCreate(fastify, test, 'get google oauth oauthGoogle1 should return existing oauth, user and token', oauthGoogle1)
  oAuthOps.getOrCreate(fastify, test, 'get github oauth oauthGithub1 should return existing oauth, user and token', oauthGithub1)
  oAuthOps.getOrCreate(fastify, test, 'get linkedin oauth oauthLinkedIn1 should return existing oauth, user and token', oauthLinkedIn1)

  oAuthOps.getOrCreateMissingEmail(fastify, test, 'create facebook oauth with missing email address should fail', oauthInvalid)
  oAuthOps.getOrCreateUnsupportedType(fastify, test, 'create oauth of unsupported type should fail', oauthUnsupportedType)

  oAuthOps.getAll(fastify, test, 'get all oauths for user1', [oauthFacebook1, oauthGoogle1, oauthGithub1, oauthLinkedIn1])
  oAuthOps.update(fastify, test, 'update facebook oauth oauthFacebook1', oauthFacebook1)
  oAuthOps.updateInvalidId(fastify, test, 'update facebook oauth oauthFacebook1 with invalidId fails', user1, data.invalidId)
  oAuthOps.delete(fastify, test, 'delete facebook oauth oauthFacebook1', oauthFacebook1)
  oAuthOps.updateNotFoundId(fastify, test, 'update deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1)
  oAuthOps.deleteInvalidId(fastify, test, 'delete facebook oauth oauthFacebook1 with invalidId should fail', user1, data.invalidId)
  oAuthOps.deleteNotFoundId(fastify, test, 'delete already deleted facebook oauth oauthFacebook1 should fail', oauthFacebook1)

  authOps.delete(fastify, test, 'delete the user1 for oauth testing', user1)

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}
run()
// nock.disableNetConnect()
