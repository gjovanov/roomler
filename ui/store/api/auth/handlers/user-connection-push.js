export const handleUserConnectionPush = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.userConnectionOpen) {
    commit('api/auth/pushUserConnection', data.data, {
      root: true
    })
  }
}
