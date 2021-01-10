
const oAuthService = require('../../services/oauth/oauth-service')
const userService = require('../../services/user/user-service')
const tokenizeUser = require('../../services/utils/utils-service').tokenizeUser
const dataGetter = require('./oauth-data-getter')
const imageDownloader = require('./oauth-image-downloader')

const getData = async (access, type) => {
  if (type === 'facebook') {
    const data = await dataGetter.getFacebookData(access)
    return data
  }
  if (type === 'twitter') {
    const data = await dataGetter.getTwitterData(access)
    return data
  }
  if (type === 'google') {
    const data = await dataGetter.getGoogleData(access)
    return data
  }
  if (type === 'github') {
    const data = await dataGetter.getGithubData(access)
    return data
  }
  if (type === 'linkedin') {
    const data = await dataGetter.getLinkedinData(access)
    return data
  }
}

const getOrCreateOAuth = async (data, type) => {
  let oauth = await oAuthService.get(null, {
    type,
    email: data.email
  })
  if (!oauth) {
    const avatarUrl = await imageDownloader.download(data.avatar_url, `${Date.now()}`)
    oauth = await oAuthService.create({
      type,
      email: data.email,
      id: data.id,
      name: data.name,
      avatar_url: avatarUrl
    })
  }
  if (oauth.user && !oauth.user.avatar_url) {
    const avatarUrl = await imageDownloader.download(data.avatar_url, `${Date.now()}`)
    await userService.updateAvatar(oauth.user._id, avatarUrl)
  }
  return oauth
}

const getToken = async (oauth, reply) => {
  let token = null
  let isAdmin = false
  if (oauth.user && oauth.user._id) {
    const tokenizedUser = tokenizeUser(oauth.user)
    token = await reply.jwtSign({
      user: tokenizedUser
    })
    isAdmin = tokenizedUser.is_admin
  }
  return {
    token,
    isAdmin
  }
}

class OAuthController {
  async getOrCreate (request, reply) {
    const type = request.query.type
    const oauthConfig = this[type]
    if (!oauthConfig) {
      throw new TypeError(`Unsupported OAuth type: ${type}`)
    }
    const access = await oauthConfig.getAccessTokenFromAuthorizationCodeFlow(request)
    const data = await getData(access, type)
    if (data && data.email) {
      const oauth = await getOrCreateOAuth(data, type)
      const { token, isAdmin } = await getToken(oauth, reply)
      reply.send({
        oauth,
        token,
        user: oauth.user,
        is_admin: isAdmin
      })
    } else {
      throw new ReferenceError(`Email address is missing with '${type}' login. Try another option.`)
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
}

module.exports = new OAuthController()
