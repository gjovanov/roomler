const defaultState = require('crypto').randomBytes(10).toString('hex')
const oauthPlugin = require('fastify-oauth2-multi')
const config = require('../../../config')
module.exports = {
  name: 'github',
  credentials: {
    client: {
      id: process.env.NODE_ENV === 'test' ? 'client_id' : (process.env.GITHUB_ID || null),
      secret: process.env.NODE_ENV === 'test' ? 'client_secret' : (process.env.GITHUB_SECRET || null)
    },
    auth: oauthPlugin.GITHUB_CONFIGURATION
  },
  startRedirectPath: '/oauth/login/github',
  callbackUri: `${config.appSettings.env.URL}/@/oauth/callback/github`,
  scope: ['user', 'user:email'],
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
