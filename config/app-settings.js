const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  HOST: process.env.HOST || 'localhost',
  PORT: process.env.PORT || 3000,
  PORT_API: process.env.PORT_API || 3001
}
if (env.HOST === '0.0.0.0') {
  env.HOST = 'localhost'
}
env.URL = process.env.URL || `http://${env.HOST}:${env.PORT}`
env.API_URL = process.env.API_URL || (process.env.NODE_ENV === 'production' ? `http://${env.HOST}:${env.PORT}` : `http://${env.HOST}:${env.PORT_API}`)

module.exports = {
  name: 'Roomler.Live',
  env
}
