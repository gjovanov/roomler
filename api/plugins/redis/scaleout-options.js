module.exports = {
  enabled: process.env.WS_SCALEOUT_ENABLED ? process.env.WS_SCALEOUT_ENABLED.toLowerCase() === 'true' : true,
  publisher: {
    namespace: 'publisher',
    host: process.env.WS_SCALEOUT_HOST || '127.0.0.1'
  },
  subscriber: {
    namespace: 'subscriber',
    host: process.env.WS_SCALEOUT_HOST || '127.0.0.1'
  }
}
