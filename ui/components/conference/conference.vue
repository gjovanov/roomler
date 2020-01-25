<template>
  <v-container
    fluid
    class="pa-0"
  >
    <conference-menu
      :user="user"
      :room="room"
      :session="session"
      :local-handle="localHandle"
      @join="join"
      @leave="leave"
    />
    <v-row
      v-if="session && screens && screens.length"
    >
      <v-col
        sm="12"
        cols="12"
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
      >
        <v-card>
          <v-card-title>
            <v-btn
              outlined
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getMember(handleDTO.display_name).avatar_url"
                  :src="getMember(handleDTO.display_name).avatar_url"
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
          <v-card-text>
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
      >
        <v-card>
          <v-card-title>
            <v-btn
              outlined
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getMember(handleDTO.display_name).avatar_url"
                  :src="getMember(handleDTO.display_name).avatar_url"
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
          <v-card-text>
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
      >
        <v-card>
          <v-card-title>
            <v-btn
              outlined
              block
            >
              <v-avatar
                size="36px"
              >
                <img
                  v-if="getMember(handleDTO.display_name).avatar_url"
                  :src="getMember(handleDTO.display_name).avatar_url"
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
          <v-card-text>
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
import ConferenceMenu from '@/components/conference/conference-menu'

export default {
  components: {
    ConferenceMenu
  },
  props: {
    user: {
      type: Object,
      default: null
    },
    room: {
      type: Object,
      default: null
    },
    members: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      session: null
    }
  },
  computed: {
    localHandle () {
      return this.session && this.session.handleDTOs ? this.session.handleDTOs.find(h => h.isLocal) : null
    },
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
      this.session = await this.$store.dispatch('api/janus/videoroom/join', janusPayload)
    },
    async leave () {
      if (this.session) {
        this.session = await this.$store.dispatch('api/janus/session/destroy', { sessionDTO: this.session })
      }
    },
    getMember (username) {
      return this.members.find(u => u.username === username) || { }
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
