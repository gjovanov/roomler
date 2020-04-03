const config = require('../../../config')
const defaultState = require('./default-state')
const oauthPlugin = require('fastify-oauth2')
console.log(process.env.FACEBOOK_ID)
module.exports = {
  name: 'facebook',
  credentials: {
    client: {
      id: process.env.NODE_ENV === 'test' ? 'client_id' : (process.env.FACEBOOK_ID || null),
      secret: process.env.NODE_ENV === 'test' ? 'client_secret' : (process.env.FACEBOOK_SECRET || null)
    },
    auth: oauthPlugin.FACEBOOK_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/facebook',
  callbackUri: `${config.appSettings.env.URL}/@/oauth/callback/facebook`,
  scope: 'email',
  generateStateFunction: () => {
    return defaultState
  },
  checkStateFunction: (state, callback) => {
    if (process.env.NODE_ENV === 'development' ||
      process.env.NODE_ENV === 'test') {
      callback()
    } else {
      if (state === defaultState) {
        callback()
        return
      }
      callback(new Error('Invalid state'))
    }
  }
}
