const config = require('../config')
config.appSettings.env.URL = 'http://localhost:3000'

// WIN-10: Check port usage
// Get-Process -Id (Get-NetTCPConnection -LocalPort 3002).OwningProcess

module.exports = {
  apps: [{
    name: 'roomler1',
    script: './server/api/index.js',
    watch: true,
    instances: 'max',
    autorestart: false,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: config.appSettings.env.NODE_ENV,
      HOST: '0.0.0.0',
      PORT: 3002,
      PORT_API: 3001,
      URL: 'http://localhost:3000'
    }
  },
  {
    name: 'roomler2',
    script: './server/api/index.js',
    watch: true,
    instances: 'max',
    autorestart: false,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: config.appSettings.env.NODE_ENV,
      HOST: '0.0.0.0',
      PORT: 3003,
      PORT_API: 3001,
      URL: 'http://localhost:3000'
    }
  },
  {
    name: 'roomler3',
    script: './server/api/index.js',
    watch: true,
    instances: 'max',
    autorestart: false,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: config.appSettings.env.NODE_ENV,
      HOST: '0.0.0.0',
      PORT: 3004,
      PORT_API: 3001,
      URL: 'http://localhost:3000'
    }
  },
  {
    name: 'roomler4',
    script: './server/api/index.js',
    watch: true,
    instances: 'max',
    autorestart: false,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: config.appSettings.env.NODE_ENV,
      HOST: '0.0.0.0',
      PORT: 3005,
      PORT_API: 3001,
      URL: 'http://localhost:3000'
    }
  }]
}
