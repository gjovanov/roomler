import {
  handleSuccess
} from '@/services/ajax-handlers'

export const handleInviteAccept = (
  dispatch,
  commit,
  state,
  rootState,
  router,
  localePath,
  data) => {
  if (data.op === rootState.api.config.config.wsSettings.opTypes.roomInviteAccept) {
    data.data.forEach(async (invite) => {
      commit('api/invite/replace', invite, {
        root: true
      })
      commit('api/auth/push', invite.invitee, {
        root: true
      })
      commit('api/room/pushUser', invite, {
        root: true
      })
      if (invite.inviter._id === rootState.api.auth.user._id) {
        handleSuccess(`'${invite.name}' invited by, has joined the room '${invite.room.path}' under username '${invite.invitee.username}'`, commit)
      } else if (invite.invitee._id === rootState.api.auth.user._id) {
        handleSuccess(`You have joined the room '${invite.room.path}'`, commit)
      } else {
        handleSuccess(`'${invite.invitee.username}' has joined the room '${invite.room.path}'`, commit)
      }
      await dispatch('sound/playSound', 'invite_accept', { root: true })
    })
  }
}
