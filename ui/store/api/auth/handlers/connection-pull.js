export const handleConnectionPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.connectionClose) {
    commit('api/auth/pullConnection', data.data, {
      root: true
    })
    commit('playSound', 'connection_pull')
  }
}
