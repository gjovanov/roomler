const config = require('roomler.config')
module.exports = {
  dbUrl: config.dbSettings.dbUrl,
  dbOptions: config.dbSettings.dbOptions
}
