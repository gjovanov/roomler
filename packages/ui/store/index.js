import cookie from 'cookie'

export const state = () => ({
  session: null
})

export const actions = {
  async nuxtServerInit ({ dispatch, commit }, { req, store }) {
    const cookies = cookie.parse(req.headers.cookie || '')
    if (cookies.token) {
      commit('api/auth/storeUserInfo', { token: cookies.token })
      await dispatch('api/auth/me')

      // await Promise.all([
      //   dispatch('api/room/getAll'),
      //   dispatch('api/auth/getPeers'),
      // ])
      //   .then((data) => {
      //     if (data && data[0] && data[0].result) {
      //       return Promise.all([dispatch('api/room/calls/getAll'), ...data[0].result.map(room => dispatch('api/message/getAll', { room }))])
      //     }
      //   })
    }
    await dispatch('api/config/get')
  },
  connectWebSocket ({
    commit,
    state
  }) {
    this.$wss.connect()
  }
}
