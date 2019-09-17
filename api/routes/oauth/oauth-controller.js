const getService = require('../../services/utils/get-service')
class OAuthController {
  async loginFacebook (request, reply) {
    const result = await this.getAccessTokenFromAuthorizationCodeFlow(request)
    const data = await getService.get({
      url: 'https://graph.facebook.com/v4.0/me?fields=email,name,picture',
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + result.access_token
      },
      json: true
    })
    reply.send(data)
  }
}

module.exports = new OAuthController()
