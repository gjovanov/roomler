const test = require('ava')
let fastify = null
const authOps = require('../.common/auth-ops')
const emailOps = require('../.common/email-ops')
const UserContext = require('../.context/user-context')
const EmailContext = require('../.context/email-context')
const data = require('./data')
const user = new UserContext(data.user)
const templateEmail = new EmailContext(data.email.template, user)
const directEmail = new EmailContext(data.email.direct, user)

const run = async () => {
  fastify = await require('../../../api/api')()

  authOps.register(fastify, test, 'register user account for email creation', user)
  authOps.activate(fastify, test, 'activate user account for email creation', user)
  emailOps.send(fastify, test, 'send the template email', templateEmail)
  emailOps.send(fastify, test, 'send the direct email', directEmail)
  emailOps.getInvalidId(fastify, test, 'get with invalid id throws a TypeError', user, data.invalidEmailId)
  emailOps.get(fastify, test, 'get the template email by id', templateEmail)
  emailOps.get(fastify, test, 'get the direct email by id', directEmail)
  emailOps.getAll(fastify, test, 'get all 2 emails [template and direct]', [templateEmail, directEmail])
  emailOps.delete(fastify, test, 'delete the template email by id', templateEmail)
  emailOps.deleteInvalidId(fastify, test, 'delete with invalid id throws a TypeError', user, data.invalidEmailId)
  emailOps.delete(fastify, test, 'delete the direct email by id', directEmail)
  emailOps.getNotFoundId(fastify, test, 'get with unexisting id throws a ReferenceError', templateEmail)
  emailOps.deleteNotFoundId(fastify, test, 'delete with unexisting id throws a ReferenceError', directEmail)

  authOps.delete(fastify, test, 'delete the email user', user)

  test.after('Shutdown API server', async (t) => {
    await fastify.close()
  })
}
run()
