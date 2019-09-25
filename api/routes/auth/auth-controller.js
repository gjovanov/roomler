const userService = require('../../services/user/user-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser

class AuthController {
  async register (request, reply) {
    const payload = request.body
    const user = await userService.register(payload)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
  }

  async reset (request, reply) {
    await userService.reset(request.body.username, request.body.type)
    reply.send({
      result: 'ok'
    })
  }

  async activate (request, reply) {
    const user = await userService.activate(request.body.username, request.body.token)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
  }

  async login (request, reply) {
    const user = await userService.login(request.body.username, request.body.password)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply
      .send({
        token,
        user
      })
  }

  async updatePassword (request, reply) {
    const payload = request.body
    const user = await userService.updatePassword(payload.username, payload.token, payload.password, payload.passwordConfirm)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
  }

  async updatePerson (request, reply) {
    const person = request.body
    const user = await userService.updatePerson(request.user.user._id, person)
    reply.send(user.person)
  }

  async me (request, reply) {
    const user = await userService.get({
      id: request.user.user._id
    })
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      user,
      token,
      person: user.person
    })
  }

  async delete (request, reply) {
    const result = await userService.delete(request.user.user._id)
    reply.send(result)
  }
}

module.exports = new AuthController()
