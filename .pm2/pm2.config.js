const config = require('../config')
config.appSettings.env.NODE_ENV = 'production'

// WIN-10: Check port usage
// Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess
module.exports = {
  apps: [{
    name: 'roomler',
    script: './server/ui/index.js',
    watch: false,
    instances: 'max',
    autorestart: false,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: config.appSettings.env.NODE_ENV,
      HOST: '0.0.0.0',
      PORT: config.appSettings.env.PORT,
      PORT_API: config.appSettings.env.PORT_API,
      URL: config.appSettings.env.URL,
      API_URL: config.appSettings.env.API_URL
    }
  }]
}
