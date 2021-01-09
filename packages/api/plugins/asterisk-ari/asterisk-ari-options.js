const config = require('roomler.config')
module.exports = {
  url: config.asteriskSettings.ariUrl,
  username: config.asteriskSettings.ariUsername,
  password: config.asteriskSettings.ariPassword,
  application: config.asteriskSettings.ariApplication,
  generateAccounts: config.asteriskSettings.ariGenerateAccounts
}
