const oauthPlugin = require('fastify-oauth2')
const config = require('roomler.config')
const defaultState = require('./default-state')
module.exports = {
  name: 'google',
  credentials: {
    client: {
      id: process.env.GOOGLE_ID,
      secret: process.env.GOOGLE_SECRET
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/google',
  callbackUri: `${config.appSettings.env.URL}/-/oauth/callback/google`,
  scope: 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}
