const wsSettings = require('../../../config').wsSettings
const scaleout = wsSettings.scaleout
const pingInterval = wsSettings.pingInterval
module.exports = {
  pingInterval,
  scaleout
}
