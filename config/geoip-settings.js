const path = require('path')
const mmdbPath = path.join(__dirname, '..', 'resources', 'mmdb', 'GeoLite2-City.mmdb')
module.exports = {
  mmdbPath: process.env.MMDB_PATH || mmdbPath
}
