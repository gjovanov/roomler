<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row
      v-if="session && screens && screens.length"
    >
      <v-col
        sm="12"
        cols="12"
        class="pa-0 ma-0"
      >
        <v-subheader>Screens</v-subheader>
      </v-col>
    </v-row>
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
          <v-card-title class="pa-0 ma-0">
            <v-btn
              outlined
              tile
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getPeer(handleDTO.display_name).avatar_url"
                  :src="getPeer(handleDTO.display_name).avatar_url"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
              {{ handleDTO.display_name }}
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0 ma-0">
            <video
              v-if="handleDTO.stream"
              :id="handleDTO.id"
              :srcObject.prop="handleDTO.stream"
              :muted="handleDTO.isPublisher ? setVideoMuted(handleDTO) : ''"
              width="100%"
              autoplay
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      v-if="session && publishers && publishers.length"
    >
      <v-col
        sm="12"
        cols="12"
        class="pa-0 ma-0"
      >
        <v-subheader>Publishers</v-subheader>
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
          <v-card-title class="pa-0 ma-0">
            <v-btn
              outlined
              tile
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getPeer(handleDTO.display_name).avatar_url"
                  :src="getPeer(handleDTO.display_name).avatar_url"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
              {{ handleDTO.display_name }}
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0 ma-0">
            <video
              v-if="handleDTO.stream"
              :id="handleDTO.id"
              :srcObject.prop="handleDTO.stream"
              :muted="handleDTO.isPublisher ? setVideoMuted(handleDTO) : ''"
              width="100%"
              autoplay
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
          <v-card-title class="pa-0 ma-0">
            <v-btn
              outlined
              tile
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getPeer(handleDTO.display_name).avatar_url"
                  :src="getPeer(handleDTO.display_name).avatar_url"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
              {{ handleDTO.display_name }}
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-0 ma-0">
            <video
              v-if="handleDTO.stream"
              :id="handleDTO.id"
              :srcObject.prop="handleDTO.stream"
              :muted="handleDTO.isPublisher ? setVideoMuted(handleDTO) : ''"
              width="100%"
              autoplay
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
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
    peers: {
      type: Array,
      default () {
        return []
      }
    },
    roomPeers: {
      type: Array,
      default () {
        return []
      }
    }
  },

  computed: {
    screens () {
      return this.session.handleDTOs.filter(h => h.screen && h.stream)
    },
    publishers () {
      return this.session.handleDTOs.filter(h => (h.audio || h.video) && !h.screen && h.stream)
    },
    attendees () {
      return this.session.handleDTOs.filter(h => !h.audio && !h.video && !h.stream)
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
      console.log(username)
      console.log(this.peers.length)
      return this.peers.find(u => u.username === username) || { }
    },
    setVideoMuted (handleDTO) {
      this.$nextTick(() => {
        const video = document.getElementById('' + handleDTO.id)
        if (video) {
          video.setAttribute('muted', 'muted')
          video.muted = true
        }
      })
    }
  }
}
</script>
