if (typeof window !== 'undefined' && window.requestAnimationFrame === undefined) {
  window.requestAnimationFrame = function (callback) {
    setTimeout(callback, 0)
  }
}

const config = {
  appSettings: require('./app-settings'),
  janusSettings: require('./janus-settings'),
  authSettings: require('./auth-settings'),
  oauthSettings: require('./oauth-settings'),
  dbSettings: require('./db-settings'),
  dataSettings: require('./data-settings'),
  wsSettings: require('./ws-settings'),
  emailSettings: require('./email-settings'),
  geoipSettings: require('./geoip-settings'),
  giphySettings: require('./giphy-settings'),
  webPushSettings: require('./web-push-settings')
}

module.exports = config
