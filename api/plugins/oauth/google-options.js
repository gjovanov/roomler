const oauthPlugin = require('fastify-oauth2')
const config = require('../../../config')
const defaultState = require('./default-state')
module.exports = {
  name: 'google',
  credentials: {
    client: {
      id: process.env.NODE_ENV === 'test' ? 'client_id' : (process.env.GOOGLE_ID || null),
      secret: process.env.NODE_ENV === 'test' ? 'client_secret' : (process.env.GOOGLE_SECRET || null)
    },
    auth: oauthPlugin.GOOGLE_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/google',
  callbackUri: `${config.appSettings.env.URL}/@/oauth/callback/google`,
  scope: 'https://www.googleapis.com/auth/userinfo.email',
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
