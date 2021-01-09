import WsService from '@/services/ws-service'

export default ({
  app
}, inject) => {
  const apiUrl = app.store.state.api.config.config.appSettings.env.API_URL
  // if (apiUrl.includes('localhost')) {
  //   apiUrl = apiUrl.replace('localhost', '127.0.0.1') // faster with ip4 than ip6 - https://stackoverflow.com/questions/15135506/websocket-connection-setup-takes-a-relatively-long-time-is-this-normal
  // }
  const wss = new WsService(apiUrl.replace(/^http/, 'ws'), app.store, app.router, app.localePath)
  inject('wss', wss)
  const payload = { router: app.router, localePath: app.localePath }
  app.store.dispatch('api/auth/subscribe', payload)
  app.store.dispatch('api/room/subscribe', payload)
  app.store.dispatch('api/invite/subscribe', payload)
  app.store.dispatch('api/message/subscribe', payload)
  app.store.dispatch('api/room/calls/subscribe', payload)
  app.store.dispatch('api/visit/subscribe', payload)
  app.store.dispatch('connectWebSocket', payload)
}
