if (typeof window !== 'undefined' && window.requestAnimationFrame === undefined) {
  window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0)
  }
}

const config = {
  appSettings: require('./settings/app-settings'),
  janusSettings: require('./settings/janus-settings'),
  asteriskSettings: require('./settings/asterisk-settings'),
  authSettings: require('./settings/auth-settings'),
  oauthSettings: require('./settings/oauth-settings'),
  dbSettings: require('./settings/db-settings'),
  dataSettings: require('./settings/data-settings'),
  wsSettings: require('./settings/ws-settings'),
  emailSettings: require('./settings/email-settings'),
  geoipSettings: require('./settings/geoip-settings'),
  giphySettings: require('./settings/giphy-settings'),
  webPushSettings: require('./settings/web-push-settings'),
  stripeSettings: require('./settings/stripe-settings')
}

module.exports = config
