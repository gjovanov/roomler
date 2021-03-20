const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'microsoft',
  credentials: {
    client: {
      id: process.env.MICROSOFT_ID,
      secret: process.env.MICROSOFT_SECRET
    },
    auth: oauthPlugin.MICROSOFT_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/microsoft',
  callbackUri: `${config.appSettings.env.URL}/-/oauth/callback/microsoft`,
  scope: 'https://graph.microsoft.com/.default',
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}