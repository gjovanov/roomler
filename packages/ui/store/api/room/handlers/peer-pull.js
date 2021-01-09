import {
  handleSuccess
} from '@/services/ajax-handlers'

export const handlePeerPull = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (
    data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerRemove ||
      data.op === rootState.api.config.config.wsSettings.opTypes.roomPeerLeave) {
    data.data.forEach(async (record) => {
      record.users.forEach((user) => {
        commit('api/auth/push', user, {
          root: true
        })
      })

      const userid = rootState.api.auth.user._id
      const isUserRemoved = record.room.owner !== userid && !record.room.members.includes(userid) && !record.room.moderators.includes(userid)
      if (isUserRemoved) {
        handleSuccess(`You have been removed from the room '${record.room.path}'`, commit)
        if (rootState.api.room.room && rootState.api.room.room._id === record.room._id) {
          await router.push({ path: localePath({ name: 'index' }) })
        }
        if (!record.room.is_open) {
          commit('api/room/pull', record.room._id, {
            root: true
          })
        } else {
          commit('api/room/push', record.room, {
            root: true
          })
        }
      } else {
        commit('api/room/push', record.room, {
          root: true
        })
      }
    })
  }
}
