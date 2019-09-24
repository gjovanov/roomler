const getService = require('../../services/utils/get-service')
const utilsService = require('../../services/utils/utils-service')
const userService = require('../../services/user/user-service')
const oAuthService = require('../../services/oauth/oauth-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser

const getFacebookData = async (access) => {
  const data = await getService.get({
    url: 'https://graph.facebook.com/v4.0/me?fields=email,name,picture.type(large)',
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access.access_token
    },
    json: true
  })
  console.log(data)
  return data
}

const getData = async (access, type) => {
  if (type === 'facebook') {
    const data = await getFacebookData(access)
    return data
  } else {
    throw new TypeError(`Unsupported OAuth type: ${type}`)
  }
}

const getOrCreateOAuth = async (data, type) => {
  const user = await userService.get({
    email: data.email
  })
  let oauth = await oAuthService.get(null, {
    type,
    email: data.email
  })
  if (!oauth) {
    oauth = await oAuthService.create({
      type,
      email: data.email,
      id: data.id,
      name: data.name,
      photoUrl: data.picture.data.url,
      user: user ? user._id : undefined
    })
  }
  return oauth
}

const getToken = async (oauth, reply) => {
  let token = null
  if (oauth.user && oauth.user._id) {
    token = await reply.jwtSign({
      user: tokenizeUser(utilsService.tokenizeUser(oauth.user))
    })
  }
  return token
}

class OAuthController {
  async getOrCreate (request, reply) {
    const type = request.query.type
    const access = await this.getAccessTokenFromAuthorizationCodeFlow(request)
    const data = await getData(access, type)
    if (data && data.email) {
      const oauth = await getOrCreateOAuth(data, type)

      const token = await getToken(oauth, reply)
      reply.send({
        oauth,
        token,
        user: oauth.user
      })
    } else {
      throw new Error(`Email info is missing with your '${type}' login. Try logging in with another option.`)
    }
  }

  async getAll (request, reply) {
    const result = await oAuthService.getAll(request.user.user._id, request.query.page, request.query.size)
    reply.send(result)
  }

  async update (request, reply) {
    const payload = request.body
    const id = request.params.id
    const update = {
      $set: payload
    }
    const result = await oAuthService.update(request.user.user._id, id, update)
    reply.send(result)
  }

  async delete (request, reply) {
    const result = await oAuthService.delete(request.user.user._id, request.params.id)
    reply.send(result)
  }

  async link (request, reply) {
    const result = await oAuthService.link(request.user.user._id, request.params.id)
    reply.send(result)
  }
}

module.exports = new OAuthController()
