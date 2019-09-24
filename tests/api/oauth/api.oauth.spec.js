import test from 'ava'
let fastify = null
const server = require('../../../server/api/api-server')
const authOps = require('../.common/auth-ops')
const oAuthOps = require('../.common/oauth-ops')
const UserContext = require('../.context/user-context')
const OAuthContext = require('../.context/oauth-context')
const data = require('./data')
const user1 = new UserContext(data.user1)
const user2 = new UserContext(data.user2)
const oauthFacebook1 = new OAuthContext(data.oauth1.facebook, 'facebook')
const oauthFacebook2 = new OAuthContext(data.oauth2.facebook, 'facebook', user2)

const run = async () => {
  // test.before('Starting API server', async (t) => {
  //   console.log('TIME TO BOOT')

  // })
  await server.up(5001)
  fastify = server.fastify

  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth for user1', oauthFacebook1)
  authOps.register(fastify, test, 'register the user1 for oauth testing', user1)
  authOps.register(fastify, test, 'register the user2 for oauth testing', user2)
  oAuthOps.getOrCreate(fastify, test, 'get facebook oauth for user2', oauthFacebook2)

  test.after('Shutdown API server', async (t) => {
    await server.down()
  })
}
run()
// nock.disableNetConnect()
