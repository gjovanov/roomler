import WsService from '@/services/ws-service'

export default ({
  app
}, inject) => {
  const apiUrl = app.store.state.api.config.config.appSettings.env.API_URL
  // if (apiUrl.includes('localhost')) {
  //   apiUrl = apiUrl.replace('localhost', '127.0.0.1') // faster with ip4 than ip6 - https://stackoverflow.com/questions/15135506/websocket-connection-setup-takes-a-relatively-long-time-is-this-normal
  // }
  const wss = new WsService(apiUrl.replace(/^http/, 'ws'), app.store, app.router)
  inject('wss', wss)
  app.store.dispatch('api/auth/subscribe', app.router)
  app.store.dispatch('api/room/subscribe', app.router)
  app.store.dispatch('api/invite/subscribe', app.router)
  app.store.dispatch('api/message/subscribe', app.router)
  app.store.dispatch('api/room/calls/subscribe', app.router)
  app.store.dispatch('api/visit/subscribe', app.router)
  app.store.dispatch('connectWebSocket', app.router)
}
