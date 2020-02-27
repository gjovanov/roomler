export const handleUserConnectionPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.userConnectionClose) {
    commit('api/auth/pullUserConnection', data.data, {
      root: true
    })
  }
}
