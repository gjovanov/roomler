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
          v-for="handleDTO in screens"
          :key="handleDTO.id"
          sm="12"
          cols="12"
          class="pa-0 ma-0"
        >
          <v-card flat>
            <v-card-text class="pa-0 ma-0">
              <video
                :id="handleDTO.id"
                :srcObject.prop="handleDTO.stream"
                :poster="getPeer(handleDTO.display_name).avatar_url"
                width="100%"
                height="100%"
                autoplay
                controls
              />
              <!-- <media-buttons :handle="handleDTO" /> -->
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="conferenceSession && publishers && publishers.length"
      >
        <v-col
          v-for="handleDTO in publishers"
          :key="handleDTO.id"
          sm="12"
          md="4"
          lg="3"
          cols="12"
          class="pa-0 ma-0"
        >
          <v-card flat>
            <v-card-text class="pa-0 ma-0">
              <video
                :id="handleDTO.id"
                :srcObject.prop="handleDTO.stream"
                :poster="getPeer(handleDTO.display_name).avatar_url"
                width="100%"
                height="240"
                autoplay
                controls
              />
              <media-buttons :handle="handleDTO" />
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

  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    screens () {
      return this.conferenceSession.handleDTOs.filter(h => h.screen)
    },
    publishers () {
      return this.conferenceSession.handleDTOs.filter(h => !h.screen)
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    },
    conferencePosition () {
      return this.roomRoute === 'calls' ? 'center' : 'left'
    }
  },
  watch: {
    'localHandle.stream' (newVal) {
      if (newVal && this.localHandle) {
        this.setVideoMuted(this.localHandle)
      }
      if (!newVal) {
        this.showVideoPoster()
      }
    },
    'localHandle.stream.videoTracks' (newVal) {
      if (newVal && this.localHandle) {
        this.setVideoMuted(this.localHandle)
      }
      if (newVal && newVal.length === 0) {
        this.showVideoPoster(this.localHandle)
      }
    }
  },
  updated () {
    const self = this
    if (this.localHandle) {
      this.setVideoMuted(this.localHandle)
      if (this.conferenceSession && this.conferenceSession.handleDTOs) {
        console.log('update')
        this.conferenceSession.handleDTOs.forEach((h) => {
          console.log(h.id)
          if (!h.stream || !h.stream.videoTracks || h.stream.videoTracks.length === 0) {
            console.log('show poster')
            self.showVideoPoster(h)
          }
        })
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.addEventListener('beforeunload', this.leave)
    })
  },
  async beforeDestroy () {
    await this.leave()
  },
  destroyed () {
    document.removeEventListener('beforeunload', this.leave)
  },
  methods: {
    async leave () {
      await this.$store.dispatch('api/conference/leave')
    },
    getPeer (username) {
      return this.peers.find(u => u.username === username) || { }
    },
    setVideoMuted (handleDTO) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (handleDTO) {
            const video = document.getElementById(handleDTO.id)
            if (video) {
              video.setAttribute('muted', 'muted')
              video.muted = true
            }
          }
        }, 100)
      })
    },
    showVideoPoster (handleDTO) {
      this.$nextTick(() => {
        setTimeout(() => {
          if (handleDTO) {
            const video = document.getElementById(handleDTO.id)
            if (video) {
              video.load()
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
