const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'linkedin',
  credentials: {
    client: {
      id: process.env.LINKEDIN_ID,
      secret: process.env.LINKEDIN_SECRET
    },
    auth: oauthPlugin.LINKEDIN_CONFIGURATION,
    options: {
      bodyFormat: 'form',
      authorizationMethod: 'body'
    }
  },
  startRedirectPath: '/oauth/login/linkedin',
  callbackUri: `${config.appSettings.env.URL}/-/oauth/callback/linkedin`,
  scope: ['r_emailaddress', 'r_liteprofile'],
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    require('./default-check-state')(defaultState, state, callback)
  }
}
