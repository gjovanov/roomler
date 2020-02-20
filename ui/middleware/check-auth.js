import {
  storage
} from '@/services/storage'

export default async function ({
  isServer,
  store,
  req
}) {
  // If nuxt generate, pass this middleware
  if (isServer && !req) return
  if (req && req.headers && req.headers.cookie && !store.state.api.auth.user) {
    storage.cookieStorage.cookie = req.headers.cookie
    if (storage.get('token')) {
      await Promise.all([store.dispatch('api/room/getAll'), store.dispatch('api/auth/getPeers'), store.dispatch('api/auth/me')])
        .then((data) => {
          if (data && data[0] && data[0].result) {
            return Promise.all(data[0].result.map(room => store.dispatch('api/message/getAll', { room })))
          }
        })
    }
  }
}
