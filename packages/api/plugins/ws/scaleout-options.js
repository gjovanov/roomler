const wsSettings = require('roomler.config').wsSettings
const scaleout = wsSettings.scaleout
const pingInterval = wsSettings.pingInterval
module.exports = {
  pingInterval,
  scaleout
}
