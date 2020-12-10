const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'github',
  credentials: {
    client: {
      id: process.env.GITHUB_ID,
      secret: process.env.GITHUB_SECRET
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/github',
  callbackUri: `${config.appSettings.env.URL}/-/oauth/callback/github`,
  scope: ['user', 'user:email'],
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}
