const userService = require('../../services/user/user-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser

const userToken = async (user, reply) => {
  const userTokenized = tokenizeUser(user)
  const token = await reply.jwtSign({
    user: userTokenized
  })
  return {
    token,
    user,
    is_admin: userTokenized.is_admin,
    timestamp: userTokenized.timestamp
  }
}

class AuthController {
  async register (request, reply) {
    const payload = request.body
    const user = await userService.register(payload)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async activate (request, reply) {
    const user = await userService.activate(request.body.username, request.body.token)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async login (request, reply) {
    const user = await userService.login(request.body.username, request.body.password)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  logout (request, reply) {
    reply.clearCookie('token', { path: '/' })

    reply.send({
      result: 'ok'
    })
  }

  async reset (request, reply) {
    await userService.reset(request.body.email, request.body.type)
    reply.send({
      result: 'ok'
    })
  }

  async updateUsername (request, reply) {
    const payload = request.body
    const user = await userService.updateUsername(payload.email, payload.token, payload.username)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async updatePassword (request, reply) {
    const payload = request.body
    const user = await userService.updatePassword(payload.email, payload.token, payload.password, payload.passwordConfirm)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async updateAvatar (request, reply) {
    const avatarUrl = request.body.avatar_url
    const user = await userService.updateAvatar(request.user.user._id, avatarUrl)
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async me (request, reply) {
    const user = await userService.get({
      id: request.user.user._id
    })
    const result = await userToken(user, reply)
    reply.send(result)
  }

  async get (request, reply) {
    const user = await userService.get({
      query: request.params.query
    })
    reply.send(user)
  }

  async getAll (request, reply) {
    const user = await userService.getAll({
      ids: request.body.ids
    })
    reply.send(user)
  }

  async getPeers (request, reply) {
    const users = await userService.getPeers(request.user.user._id)
    reply.send(users)
  }

  async delete (request, reply) {
    const result = await userService.delete(request.user.user._id)
    reply.send(result)
  }
}

module.exports = new AuthController()
