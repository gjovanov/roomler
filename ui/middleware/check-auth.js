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
      await store.dispatch('api/auth/me')
      await store.dispatch('api/room/getAll')
    }
  }
}
