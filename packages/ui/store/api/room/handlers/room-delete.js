import {
  handleSuccess
} from '@/services/ajax-handlers'

export const handleRoomDelete = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomDelete) {
    data.data.forEach((record) => {
      const room = record.room
      const children = record.children
      const all = [room, ...children]
      const ids = all.map(r => r._id)
      const currentRoom = rootState.api.room.room ? all.find(r => r._id === rootState.api.room.room._id) : null
      commit('api/room/pullAll', ids, {
        root: true
      })
      if (currentRoom) {
        handleSuccess(`'${currentRoom.name}' was deleted by the owner`, commit)
        router.push({ path: localePath({ name: 'index' }) })
      }
    })
  }
}
