export const handleConnectionPush = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.connectionOpen) {
    commit('api/auth/pushConnection', data.data, {
      root: true
    })
  }
}
