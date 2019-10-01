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
  if (req && req.headers && req.headers.cookie && !store.state.auth.user) {
    storage.cookieStorage.cookie = req.headers.cookie
    await store.dispatch('auth/me')
  }
  // const loggedUser = isServer ? getUserFromCookie(req) : getUserFromLocalStorage()
  // store.commit('SET_USER', loggedUser)
}
