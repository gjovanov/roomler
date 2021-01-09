export const actions = {
  ondata ({
    commit,
    dispatch
  }, { handleDto, data }) {
    // TODO: Add data handling
  },
  async onmessage ({
    commit,
    dispatch
  }, { handleDto, msg, jsep }) {
    this.$Janus.log(`onmessage: ${JSON.stringify(msg)}`)

    if (msg.audiobridge === 'joined') {
      this.$Janus.log('onmessage:attached')
      if (handleDto.isLocal) {
        await dispatch('api/room/calls/openCall', { room: handleDto.room._id, call_id: handleDto.call_id }, { root: true })
      }
      this.$Janus.log('onmessage:joined')
      await dispatch('handleJoined', { handleDto, msg })
    }
    if (msg.joining) {
      this.$Janus.log('onmessage:joining')
      await dispatch('handleJoining', { handleDto, joining: msg.joining })
    }
    if (msg.audiobridge === 'event') {
      this.$Janus.log('onmessage:event')
      await dispatch('handleEvent', { handleDto, msg })
    }
    if (msg.audiobridge === 'attached') {
      await dispatch('handleAttached', { handleDto, msg })
    }
    if (msg.publishers && msg.publishers.length) {
      this.$Janus.log('onmessage:publishers')
      await dispatch('handlePublishers', { handleDto, publishers: msg.publishers })
    }
    if (msg.attendees && msg.attendees.length) {
      this.$Janus.log('onmessage:attendees')
      await dispatch('handleAttendees', { handleDto, attendees: msg.attendees })
    }
    if (msg.configured === 'ok') {
      this.$Janus.log('onmessage:configured')
      this.$Janus.log(msg)
      await dispatch('handleConfigured', { handleDto })
    }
    if (msg.unpublished) {
      this.$Janus.log('onmessage:unpublished')
      await dispatch('handleUnpublished', { handleDto, unpublished: msg.unpublished })
    }
    if (msg.leaving) {
      this.$Janus.log('onmessage:leaving')
      await dispatch('handleLeaving', { handleDto, leaving: msg.leaving })
    }
    if (jsep) {
      await dispatch('handleJsep', { handleDto, jsep })
    }
    if (msg.audiobridge === 'destroyed') {
      this.$Janus.log('onmessage:destroyed')
      await dispatch('handleDestroyed', { handleDto })
    }
    if (msg.error) {
      this.$Janus.log('onmessage:error')
      await dispatch('handleError', { handleDto, error: msg.error })
    }
  },

  handleJoined ({
    commit,
    dispatch
  }, { handleDto, msg }) {
    this.$Janus.log('handleJoined')
    commit('api/janus/audiobridge/updates/setId', { handleDto, id: msg.id, privateId: msg.private_id }, { root: true })
    commit('api/janus/audiobridge/updates/setDisplay', { handleDto, display: msg.display }, { root: true })
    if (handleDto.media.audio.enabled || handleDto.media.video.enabled || handleDto.media.screen.enabled) {
      dispatch('api/janus/audiobridge/handle/createOffer', { handleDto }, { root: true })
        .then(jsep => dispatch('api/janus/audiobridge/api/configure', { handleDto, jsep }, { root: true }))
    }
  },
  handleJoining ({
    commit,
    dispatch
  }, { handleDto, joining }) {
    this.$Janus.log('handleJoining')
    const id = joining.id
    const display = joining.display
    const args = {
      plugin: handleDto.plugin,
      roomid: handleDto.roomid,
      room: handleDto.room,
      display,
      ptype: 'attendee',
      id
    }
    dispatch('api/janus/audiobridge/handle/attachAttendee', { sessionDto: handleDto.sessionDto, args }, { root: true })
  },
  handleEvent ({
    commit,
    dispatch
  }, { handleDto, msg }) {
    this.$Janus.log('handleEvent')
    const foundHandleDTO = handleDto.sessionDto.audiobridgeHandles.find(h => h.id === msg.id)
    if (foundHandleDTO) {
      commit('api/janus/audiobridge/updates/setDisplay', { handleDto: foundHandleDTO, display: msg.display }, { root: true })
    }
  },
  handleAttached ({
    commit,
    dispatch
  }, { handleDto, msg }) {
    this.$Janus.log('handleAttached')
    commit('api/janus/audiobridge/updates/setId', { handleDto, id: msg.id, privateId: msg.private_id }, { root: true })
    commit('api/janus/audiobridge/updates/setDisplay', { handleDto, display: msg.display }, { root: true })
  },
  handlePublishers ({
    commit,
    dispatch
  }, { handleDto, publishers }) {
    for (const p in publishers) {
      const id = publishers[p].id
      const display = publishers[p].display
      const audioCodec = publishers[p].audio_codec
      const videoCodec = publishers[p].video_codec
      const myid = handleDto.id
      if (myid !== id) {
        const args = {
          plugin: handleDto.plugin,
          roomid: handleDto.roomid,
          room: handleDto.room,
          display,
          ptype: 'subscriber',
          isLocal: false,
          id,
          audioCodec,
          videoCodec
        }
        dispatch('api/janus/audiobridge/handle/attachSubscriber', { sessionDto: handleDto.sessionDto, args }, { root: true })
          .then(newHandleDTO => dispatch('api/janus/audiobridge/api/joinSubscriber', { handleDto: newHandleDTO }, { root: true }))
      }
    }
  },

  handleAttendees ({
    commit,
    dispatch
  }, { handleDto, attendees }) {
    for (const a in attendees) {
      const id = attendees[a].id
      const display = attendees[a].display
      const args = {
        plugin: handleDto.plugin,
        roomid: handleDto.roomid,
        room: handleDto.room,
        display,
        isLocal: false,
        ptype: 'attendee',
        id
      }
      dispatch('api/janus/audiobridge/handle/attachAttendee', { sessionDto: handleDto.sessionDto, args }, { root: true })
    }
  },

  async handleConfigured ({
    commit,
    dispatch
  }, { handleDto }) {
    const result = await dispatch('api/janus/audiobridge/api/listparticipants', { handleDto }, { root: true })
    if (result.participants) {
      result.participants.forEach((p) => {
        const handle = handleDto.sessionDto.audiobridgeHandles.find(h => h.id === p.id)
        if (handle) {
          commit('api/janus/audiobridge/updates/setDisplay', { handleDto: handle, display: p.display }, { root: true })
        }
      })
    }
    this.$Janus.log('Configuration has finished')
  },

  handleUnpublished ({
    commit,
    dispatch
  }, { handleDto, unpublished }) {
    if (unpublished === 'ok') {
      commit('api/janus/audiobridge/updates/clearStream', { handleDto }, { root: true })
      commit('api/janus/audiobridge/updates/setMedia',
        {
          handleDto,
          media: {
            audio: {
              enabled: false
            },
            video: {
              enabled: false
            },
            screen: {
              enabled: false
            },
            data: {
              enabled: false
            }
          }
        }, { root: true })
    } else {
      const foundHandleDTO = handleDto.sessionDto.audiobridgeHandles.find(h => h.id === unpublished)
      if (foundHandleDTO) {
        commit('api/janus/audiobridge/updates/clearStream', { handleDto: foundHandleDTO }, { root: true })
        commit('api/janus/audiobridge/updates/setMedia',
          {
            handleDto: foundHandleDTO,
            media: {
              audio: {
                enabled: false
              },
              video: {
                enabled: false
              },
              screen: {
                enabled: false
              },
              data: {
                enabled: false
              }
            }
          }, { root: true })
      }
    }
  },

  async handleLeaving ({
    commit,
    dispatch
  }, { handleDto, leaving }) {
    if (leaving === 'ok') {
      commit('api/janus/audiobridge/updates/clearStream', { handleDto }, { root: true })
      commit('api/janus/audiobridge/updates/setMedia',
        {
          handleDto,
          media: {
            audio: {
              enabled: false
            },
            video: {
              enabled: false
            },
            screen: {
              enabled: false
            },
            data: {
              enabled: false
            }
          }
        }, { root: true })
    } else {
      const foundHandleDTO = handleDto.sessionDto.audiobridgeHandles.find(h => h.id === leaving)
      if (foundHandleDTO) {
        await dispatch('api/janus/audiobridge/handle/detach', { handleDto: foundHandleDTO }, { root: true })
        commit('api/janus/audiobridge/handle/pull', { sessionDto: foundHandleDTO.sessionDto, handleDto: foundHandleDTO }, { root: true })
      }
    }
  },

  handleJsep ({
    commit,
    dispatch
  }, { handleDto, jsep }) {
    this.$Janus.log('handleJsep')
    if (handleDto.isPublisher) {
      this.$Janus.log('handleRemoteJsep')
      handleDto.handle.handleRemoteJsep({ jsep })
    } else {
      this.$Janus.log('createAnswer jsep')
      dispatch('api/janus/audiobridge/handle/createAnswer', { handleDto, jsep }, { root: true })
        .then(jsepObj => dispatch('api/janus/audiobridge/api/start', { handleDto, jsep: jsepObj }, { root: true }))
    }
  },

  handleDestroyed ({
    commit,
    dispatch
  }, { handleDto, jsep }) {
    this.$Janus.log('handleDestroyed')
    // TODO: Add cleanup
  },

  handleError ({
    commit,
    dispatch
  }, { handleDto, error }) {
    this.$Janus.log(`JANUS ERROR: ${error}`)
    // TODO: Add proper housekeeping logic
  }
}
