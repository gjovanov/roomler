export const handleConnectionPull = async (
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
    await dispatch('sound/playSound', 'connection_pull', { root: true })
  }
}
