const oauthPlugin = require('fastify-oauth2')
const config = require('../../config')

module.exports = {
  name: 'facebookOAuth2',
  credentials: {
    client: {
      id: process.env.FACEBOOK_ID || null,
      secret: process.env.FACEBOOK_SECRET || null
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/facebook',
  callbackUri: `${config.appSettings.env.API_URL}/oauth/callback/facebook`,
  scope: ['email']
}
