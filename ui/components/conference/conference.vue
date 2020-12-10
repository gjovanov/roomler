<template>
  <portal :to="`conference-${conferencePosition}`">
    <v-container
      fluid
      class="pa-0"
    >
      <v-row v-if="conferenceSession && remoteSipHandle" v-show="false">
        <v-col
          cols="12"
          class="pa-1 ma-0"
        />
        <audio

          :id="remoteSipHandle.id"
          :srcObject.prop="remoteSipHandle.stream"
          width="100%"
          height="100%"
          autoplay
        />
      </v-row>
      <v-row
        v-if="conferenceSession && screens && screens.length"
      >
        <v-col
          v-for="handleDto in screens"
          :key="handleDto.id"
          sm="12"
          cols="12"
          class="pa-1 ma-0"
        >
          <v-card elevation="12" color="teal lighten-5">
            <v-card-text class="pa-0 ma-0" style="max-height: 640px">
              <video
                :id="handleDto.id"
                :srcObject.prop="handleDto.stream"
                :poster="getPeer(handleDto.display_name).avatar_url"
                width="100%"
                height="100%"
                style="max-height: 640px"
                autoplay
                playsinline
                @dblclick="toggleFullScreen(handleDto)"
              />
              <media-buttons :handle="handleDto" :conference-position="conferencePosition" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="conferenceSession && publishers && publishers.length"
      >
        <v-col
          v-for="handleDto in publishers"
          :key="handleDto.id"
          sm="12"
          md="4"
          lg="3"
          cols="12"
          class="pa-1 ma-0"
        >
          <v-card elevation="12" color="teal lighten-5">
            <v-card-text class="pa-0 ma-0" style="max-height: 240px; height: 100%;">
              <video
                :id="handleDto.id"
                :srcObject.prop="handleDto.stream"
                :poster="getPeer(handleDto.display_name).avatar_url"
                width="100%"
                height="100%"
                style="max-height: 240px; height: 100vh; object-fit: cover;"
                :autoplay="handleDto.media.audio.enabled || handleDto.media.video.enabled || handleDto.media.screen.enabled"
                playsinline
                @dblclick="toggleFullScreen(handleDto)"
              />
              <media-buttons :handle="handleDto" :conference-position="conferencePosition" />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </portal>
</template>

<script>

import MediaButtons from '@/components/conference/media-buttons'

export default {
  components: {
    MediaButtons
  },
  props: {
    peers: {
      type: Array,
      default () {
        return []
      }
    },
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    conferenceSession: {
      type: Object,
      default: null
    },
    conferenceRoom: {
      type: Object,
      default: null
    },
    roomRoute: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      eventNames: ['beforeunload', 'unload', 'pagehide'],
      doubleClickTimer: null
    }
  },

  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    screens () {
      return this.conferenceSession.videoroomHandles.filter(h => h.media.screen.enabled && !h.isLocal)
    },
    publishers () {
      return this.conferenceSession.videoroomHandles.filter(h => !(h.media.screen.enabled && !h.isLocal))
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    },
    remoteSipHandle () {
      const result = this.$store.getters['api/conference/remoteSipHandle']
      return result
    },
    conferencePosition () {
      return this.roomRoute && this.roomRoute.startsWith('calls') ? 'center' : 'left'
    }
  },
  updated () {
    if (this.localHandle) {
      this.setVideoMuted(this.localHandle)
    }
    if (this.conferenceSession && this.conferenceSession.videoroomHandles) {
      this.conferenceSession.videoroomHandles.filter(h => !(h.isLocal && h.media.screen.enabled)).forEach(async (h) => {
        if (h.stream) {
          const video = document.getElementById(h.id)
          if (video) {
            video.setAttribute('autoplay', 'autoplay')
            try {
              await video.play()
            } catch (e) {
              this.$consola.info(e)
            }
          }
        }
      })
    }
  },
  mounted () {
    const self = this
    this.$nextTick(() => {
      self.eventNames.forEach((eventName) => {
        try {
          window.addEventListener(eventName, self.leave)
        } catch {
          self.$consola.info(`'${eventName}' event doesn't exit`)
        }
      })
    })
  },
  beforeDestroy () {
    this.leave()
  },
  destroyed () {
    this.eventNames.forEach((eventName) => {
      try {
        window.removeEventListener(eventName, self.leave)
      } catch {
        self.$consola.info(`'${eventName}' event doesn't exit`)
      }
    })
  },
  methods: {
    leave () {
      this.$store.dispatch('api/conference/leave')
    },
    getPeer (username) {
      return this.peers.find(u => u.username === username) || { }
    },
    setVideoMuted (handleDto) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (handleDto) {
            const video = document.getElementById(handleDto.id)
            if (video) {
              video.setAttribute('muted', 'muted')
              video.muted = true
            }
          }
        }, 100)
      })
    },
    showVideoPoster (handleDto) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (handleDto) {
            const video = document.getElementById(handleDto.id)
            if (video) {
              video.load()
              video.setAttribute('autoplay', 'autoplay')
            }
          }
        }, 100)
      })
    },

    toggleFullScreen (handleDto) {
      this.$nextTick(() => {
        setTimeout(async () => {
          if (handleDto) {
            const video = document.getElementById(handleDto.id)
            if (!document.fullscreenElement) {
              await video.requestFullscreen()
            } else {
              document.exitFullscreen()
            }
          }
        }, 100)
      })
    }
  }
}
</script>

<style>
video {
   object-fit: scale-down;
}
</style>
