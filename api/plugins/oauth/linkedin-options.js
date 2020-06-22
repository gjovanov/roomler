const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'linkedin',
  credentials: {
    client: {
      id: process.env.NODE_ENV === 'test' ? 'client_id' : (process.env.LINKEDIN_ID || null),
      secret: process.env.NODE_ENV === 'test' ? 'client_secret' : (process.env.LINKEDIN_SECRET || null)
    },
    auth: oauthPlugin.LINKEDIN_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/linkedin',
  callbackUri: `${config.appSettings.env.URL}/@/oauth/callback/linkedin`,
  scope: ['r_emailaddress', 'r_liteprofile'],
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}
