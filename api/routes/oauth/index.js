const oAuthController = require('./oauth-controller')

module.exports = [{
  method: 'GET',
  url: '/oauth/callback/facebook',
  handler: oAuthController.loginFacebook
}]
