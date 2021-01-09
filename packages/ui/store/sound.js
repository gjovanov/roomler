export const state = () => ({
  sound: {
    connection_push: {
      file_name: '/audio/online.mp3',
      audio: null
    },
    connection_pull: {
      file_name: '/audio/uber_offline.mp3',
      audio: null
    },
    message_create: {
      file_name: '/audio/all-eyes-on-me.mp3',
      audio: null
    },
    reaction_push: {
      file_name: '/audio/disconnect.mp3',
      audio: null
    },
    reaction_pull: {
      file_name: '/audio/call_connect.mp3',
      audio: null
    },
    invite_accept: {
      file_name: '/audio/sunny.mp3',
      audio: null
    }
  }
})

export const mutations = {
  initSound (state, type) {
    if (state.sound && state.sound[type] && state.sound[type].audio === null) {
      state.sound[type].audio = new Audio(state.sound[type].file_name)
    }
  }
}

export const actions = {
  async playSound ({
    dispatch,
    commit,
    state
  }, type) {
    commit('initSound', type)
    const audioToPlay = state.sound[type].audio
    if (audioToPlay) {
      try {
        await audioToPlay.play()
      } catch (e) {
        this.$consola.info(`Cannot play sound: ${e}`)
      }
    }
  }
}
