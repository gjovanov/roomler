export const handleRoomUpdate = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomUpdate) {
    data.data.forEach((record) => {
      const room = record.room
      const children = record.children
      const all = [room, ...children]
      const oldPath = rootState.api.room.room ? rootState.api.room.room.path : null
      all.forEach((r) => {
        commit('api/room/push', r, {
          root: true
        })
        commit('api/room/open', r, {
          root: true
        })
        if (rootState.api.room.room && r._id === rootState.api.room.room._id && r.path !== oldPath && router.currentRoute) {
          router.push({ path: router.currentRoute.path.replace(oldPath, r.path) })
        }
      })
    })
  }
}
