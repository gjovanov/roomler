const userService = require('../../services/user/user-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser
const performanceService = require('../../services/performance/performance-service')
const userConnectionService = require('../../services/user-connection/user-connection-service')

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

  async reset (request, reply) {
    await userService.reset(request.body.email, request.body.type)
    reply.send({
      result: 'ok'
    })
  }

  async updateUsername (request, reply) {
    const payload = request.body
    const user = await userService.updateUsername(payload.email, payload.token, payload.username)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
  }

  async updatePassword (request, reply) {
    const payload = request.body
    const user = await userService.updatePassword(payload.email, payload.token, payload.password, payload.passwordConfirm)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
  }

  async updateAvatar (request, reply) {
    const avatarUrl = request.body.avatar_url
    const user = await userService.updateAvatar(request.user.user._id, avatarUrl)
    const token = await reply.jwtSign({
      user: tokenizeUser(user)
    })
    reply.send({
      token,
      user
    })
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
      token
    })
  }

  async get (request, reply) {
    const user = await userService.get({
      username: request.params.username
    })
    reply.send(user)
  }

  async delete (request, reply) {
    const result = await userService.delete(request.user.user._id)
    reply.send(result)
  }

  async pushUserConnectionWs (wss, conn, payload) {
    try {
      performanceService.performance.mark('UserConnectionCreate start')
      const userConnection = await userConnectionService.create(conn.user ? conn.user._id : null, payload)
      performanceService.performance.mark('UserConnectionCreate end')
      performanceService.performance.measure('UserConnectionCreate', 'UserConnectionCreate start', 'UserConnectionCreate end')

      if (conn.user) {
        performanceService.performance.mark('UserConnectionUpdate start')
        await userService.pushUserConnection(conn.user._id, userConnection._id)
        performanceService.performance.mark('UserConnectionUpdate end')
        performanceService.performance.measure('UserConnectionUpdate', 'UserConnectionUpdate start', 'UserConnectionUpdate end')
      }

      return userConnection
    } catch (err) {
      console.log(err)
    }
  }

  async pullUserConnectionWs (wss, conn) {
    const id = conn.user_connection_id
    if (id) {
      try {
        performanceService.performance.mark('UserConnectionClose start')
        const userConnection = await userConnectionService.close(id)
        performanceService.performance.mark('UserConnectionClose end')
        performanceService.performance.measure('UserConnectionClose', 'UserConnectionCreate start', 'UserConnectionCreate end')

        if (conn.user && userConnection) {
          performanceService.performance.mark('UserConnectionUpdate start')
          await userService.pullUserConnection(conn.user._id, userConnection._id)
          performanceService.performance.mark('UserConnectionUpdate end')
          performanceService.performance.measure('UserConnectionUpdate', 'UserConnectionUpdate start', 'UserConnectionUpdate end')
        }

        return userConnection
      } catch (err) {
        console.log(err)
      }
    }
  }
}

module.exports = new AuthController()
