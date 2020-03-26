<template>
  <portal :to="`conference-${conferencePosition}`">
    <v-container
      fluid
      class="pa-0"
    >
      <v-row
        v-if="session && screens && screens.length"
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
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="session && publishers && publishers.length"
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
                height="100%"
                autoplay
                controls
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="session && attendees && attendees.length"
      >
        <v-col
          sm="12"
          cols="12"
          class="pa-0 ma-0"
        >
          <v-subheader>Attendees</v-subheader>
        </v-col>
      </v-row>
      <v-row
        v-if="session && attendees && attendees.length"
      >
        <v-col
          v-for="handleDTO in attendees"
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
                height="100%"
                autoplay
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </portal>
</template>

<script>

export default {
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    session: {
      type: Object,
      default: null
    },
    conferenceRoom: {
      type: Object,
      default: null
    },
    conferencePosition: {
      type: String,
      default: ''
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    roomPeers () {
      return this.room ? this.$store.getters['api/auth/getRoomPeers'](this.room) : []
    },
    screens () {
      return this.session.handleDTOs.filter(h => h.screen && h.stream)
    },
    publishers () {
      return this.session.handleDTOs.filter(h => (h.audio || h.video) && !h.screen && h.stream)
    },
    attendees () {
      return this.session.handleDTOs.filter(h => !h.audio && !h.video && !h.stream)
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    }
  },
  watch: {
    'localHandle.stream' (newVal) {
      if (newVal && this.localHandle) {
        this.setVideoMuted(this.localHandle)
      }
    },
    'localHandle.stream.videoTracks' (newVal) {
      if (newVal && this.localHandle) {
        this.setVideoMuted(this.localHandle)
      }
    }
  },
  updated () {
    if (this.localHandle) {
      this.setVideoMuted(this.localHandle)
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
    async join (janusPayload) {
      await this.$store.dispatch('api/conference/join', janusPayload)
    },
    async leave () {
      await this.$store.dispatch('api/conference/leave')
    },
    getPeer (username) {
      return this.peers.find(u => u.username === username) || { }
    },
    setVideoMuted (handleDTO) {
      this.$nextTick(() => {
        setTimeout(() => {
          const video = document.getElementById(handleDTO.id)
          if (video) {
            video.setAttribute('muted', 'muted')
            video.muted = true
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
