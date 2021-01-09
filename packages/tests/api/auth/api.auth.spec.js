const test = require('ava')
let fastify = null
const authOps = require('../.common/auth-ops')
const UserContext = require('../.context/user-context')
const data = require('./data')
const user = new UserContext(data.user, data.avatar)

const run = async () => {
  fastify = await require('roomler.api')()

  authOps.register(fastify, test, 'register the user for auth testing', user)
  authOps.get(fastify, test, 'get user information for the logged in user', user)
  authOps.activateInvalidUsername(fastify, test, 'activate with invalid username throws ValidationError', data.invalidUsername)
  authOps.activateInvalidToken(fastify, test, 'activate with invalid token throws ValidationError', user, data.invalidToken)
  authOps.activate(fastify, test, 'activate the user for auth testing', user)
  authOps.loginInvalidPassword(fastify, test, 'login with invalid password throws ValidationError', user, data.invalidPassword)
  authOps.login(fastify, test, 'login with the user for auth testing', user)
  authOps.logout(fastify, test, 'logout the user for auth testing', user)
  authOps.login(fastify, test, 'login with the user again for auth testing', user)

  authOps.reset(fastify, test, 'username reset via code/token', user, 'username_reset')
  authOps.updateUsername(fastify, test, 'update the username of the user for auth testing', user)

  authOps.reset(fastify, test, 'password reset via code/token', user, 'password_reset')
  authOps.updatePasswordPasswordsMismatch(fastify, test, 'update password with password mismatch throws ValidationError', user, data.invalidPassword)
  authOps.updatePassword(fastify, test, 'update the password of the user for auth testing', user)

  authOps.updateAvatar(fastify, test, 'fills the Avatar URL to the user for auth testing', user)

  authOps.me(fastify, test, 'get full user information for the logged in user', user)
  authOps.delete(fastify, test, 'delete the user for auth testing', user)
  authOps.meInvalidToken(fastify, test, 'trying to get full user information for a deleted user throws a ValidationError', user)

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}

run()
