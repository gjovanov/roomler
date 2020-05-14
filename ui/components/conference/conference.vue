<template>
  <portal :to="`conference-${conferencePosition}`">
    <v-container
      fluid
      class="pa-0"
    >
      <v-row
        v-if="conferenceSession && screens && screens.length"
      >
        <v-col
          v-for="handleDto in screens"
          :key="handleDto.id"
          sm="12"
          cols="12"
          class="pa-0 ma-0"
        >
          <v-card elevation="12">
            <v-card-text class="pa-0 ma-0" style="max-height: 640px">
              <video
                :id="handleDto.id"
                :srcObject.prop="handleDto.stream"
                :poster="getPeer(handleDto.display_name).avatar_url"
                width="100%"
                height="100%"
                style="max-height: 640px"
                autoplay
                controls
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
          class="pa-0 ma-0"
        >
          <v-card elevation="12">
            <v-card-text class="pa-0 ma-0" style="max-height: 240px">
              <video
                :id="handleDto.id"
                :srcObject.prop="handleDto.stream"
                :poster="getPeer(handleDto.display_name).avatar_url"
                width="100%"
                height="100%"
                style="max-height: 240px"
                :autoplay="handleDto.media.audio.enabled || handleDto.media.video.enabled || handleDto.media.screen.enabled"
                :controls="handleDto.media.audio.enabled || handleDto.media.video.enabled || handleDto.media.screen.enabled"
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
    const iOS = ['iPad', 'iPhone', 'iPod'].includes(navigator.platform)
    const eventName = iOS ? 'pagehide' : 'beforeunload'
    return {
      iOS,
      eventName
    }
  },

  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    screens () {
      return this.conferenceSession.handleDtos.filter(h => h.media.screen.enabled && !h.isLocal)
    },
    publishers () {
      return this.conferenceSession.handleDtos.filter(h => !(h.media.screen.enabled && !h.isLocal))
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    },
    conferencePosition () {
      return this.roomRoute === 'calls' ? 'center' : 'left'
    }
  },
  updated () {
    if (this.localHandle) {
      this.setVideoMuted(this.localHandle)
    }
    if (this.conferenceSession && this.conferenceSession.handleDtos) {
      this.conferenceSession.handleDtos.filter(h => !(h.isLocal && h.media.screen.enabled)).forEach(async (h) => {
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
      window.addEventListener(self.eventName, self.leave)
    })
  },
  beforeDestroy () {
    this.leave()
  },
  destroyed () {
    window.removeEventListener(this.eventName, this.leave)
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
    }
  }
}
</script>

<style>
video {
   object-fit: scale-down;
}
</style>
