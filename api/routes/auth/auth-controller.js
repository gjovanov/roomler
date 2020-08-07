const userService = require('../../services/user/user-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser

class AuthController {
  async register (request, reply) {
    const payload = request.body
    const user = await userService.register(payload)
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      token,
      user,
      is_admin: userTokenized.is_admin
    })
  }

  async activate (request, reply) {
    const user = await userService.activate(request.body.username, request.body.token)
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      token,
      user,
      is_admin: userTokenized.is_admin
    })
  }

  async login (request, reply) {
    const user = await userService.login(request.body.username, request.body.password)
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply
      .send({
        token,
        user,
        is_admin: userTokenized.is_admin
      })
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
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      token,
      user,
      is_admin: userTokenized.is_admin
    })
  }

  async updatePassword (request, reply) {
    const payload = request.body
    const user = await userService.updatePassword(payload.email, payload.token, payload.password, payload.passwordConfirm)
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      token,
      user,
      is_admin: userTokenized.is_admin
    })
  }

  async updateAvatar (request, reply) {
    const avatarUrl = request.body.avatar_url
    const user = await userService.updateAvatar(request.user.user._id, avatarUrl)
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      token,
      user,
      is_admin: userTokenized.is_admin
    })
  }

  async me (request, reply) {
    const user = await userService.get({
      id: request.user.user._id
    })
    const userTokenized = tokenizeUser(user)
    const token = await reply.jwtSign({
      user: userTokenized
    })
    reply.send({
      user,
      token,
      is_admin: userTokenized.is_admin
    })
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
