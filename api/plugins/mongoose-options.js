const config = require('../../config')
module.exports = {
  dbUrl: config.dbSettings.dbUrl,
  dbOptions: config.dbSettings.dbOptions
}
