export const actions = {
  attach ({
    commit,
    dispatch
  }, { sessionDto, args }) {
    if (!args.plugin || args.plugin === 'janus.plugin.videoroom') {
      return dispatch('api/janus/videoroom/handle/attach', { sessionDto, args }, { root: true })
    } else if (args.plugin === 'janus.plugin.sip') {
      return dispatch('api/janus/sip/handle/attach', { sessionDto, args }, { root: true })
    } else if (args.plugin === 'janus.plugin.audiobridge') {
      return dispatch('api/janus/audiobridge/handle/attach', { sessionDto, args }, { root: true })
    }
  },

  detach ({
    commit,
    dispatch
  }, { handleDto }) {
    if (!handleDto.plugin || handleDto.plugin === 'janus.plugin.videoroom') {
      return dispatch('api/janus/videoroom/handle/detach', { handleDto }, { root: true })
    } else if (handleDto.plugin === 'janus.plugin.sip') {
      return dispatch('api/janus/sip/handle/detach', { handleDto }, { root: true })
    } else if (handleDto.plugin === 'janus.plugin.audiobridge') {
      return dispatch('api/janus/audiobridge/handle/detach', { handleDto }, { root: true })
    }
  }
}
