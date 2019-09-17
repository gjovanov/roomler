export default function ({
  $axios,
  store
}) {
  $axios.onRequest((config) => {
    // config.withCredentials = true
    if (store.state.auth.token) {
      config.headers.common.Authorization = `Bearer ${store.state.auth.token}`
      // config.headers.common.crossDomain = true
      // config.header.common['Content-Type'] = 'application/json'
    }
  })
}
