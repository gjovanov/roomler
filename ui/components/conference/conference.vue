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
      v-if="session && session.handleDTOs"
    >
      <v-col
        v-for="handleDTO in session.handleDTOs"
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
                  v-if="getMember(handleDTO.display).avatar_url"
                  alt="Avatar"
                  :src="getMember(handleDTO.display).avatar_url"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
              {{ handleDTO.display }}
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
      this.session = await this.$store.dispatch('janus/join', janusPayload)
    },
    async leave () {
      if (this.session) {
        await this.$store.dispatch('api/janus/session/destroy', { sessionDTO: this.session })
        this.session = null
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
