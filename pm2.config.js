const config = require('./config')
config.appSettings.env.NODE_ENV = 'production'
config.appSettings.env.URL = 'http://localhost:3000'

// WIN-10: Check port usage
// Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess
console.log(config.appSettings.env.NODE_ENV)
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
      PORT: 3000,
      PORT_API: 3000,
      URL: 'http://localhost:3000'
    }
  }]
}
