const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'facebook',
  credentials: {
    client: {
      id: process.env.FACEBOOK_ID,
      secret: process.env.FACEBOOK_SECRET
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/facebook',
  callbackUri: `${config.appSettings.env.URL}/-/oauth/callback/facebook`,
  scope: 'email',
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}
