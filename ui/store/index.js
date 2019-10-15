export const state = () => ({
  session: null
})

export const actions = {
  async nuxtServerInit ({ dispatch }, { req, store }) {
    console.log('[INIT]')
    await dispatch('api/config/get')
    // if (store.getters['api/auth/isAuthenticated']) {
    //   await dispatch('api/room/getAll')
    // }
  }
}
