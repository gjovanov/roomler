<template>
  <v-container
    fluid
    class="pa-0"
  >
    <v-row>
      <v-col cols="12">
        <v-dialog
          v-model="joinDialog"
          max-width="290"
        >
          <v-card>
            <v-card-title v-if="join.type === 'Join'" class="headline">
              Join the conference
            </v-card-title>
            <v-card-title v-if="join.type === 'Publish'" class="headline">
              Publish in the conference
            </v-card-title>

            <v-card-text>
              Select your media.
              <v-spacer />
              <v-btn
                outlined
                :text="!join.sendVideo"
                @click="join.sendVideo = !join.sendVideo"
              >
                <v-icon v-if="join.sendVideo">
                  fa-video
                </v-icon>
                <v-icon v-if="!join.sendVideo">
                  fa-video-slash
                </v-icon>
              </v-btn>
              <v-btn
                outlined
                :text="!join.sendAudio"
                @click="join.sendAudio = !join.sendAudio"
              >
                <v-icon v-if="join.sendAudio">
                  fa-microphone
                </v-icon>
                <v-icon v-if="!join.sendAudio">
                  fa-microphone-slash
                </v-icon>
              </v-btn>
            </v-card-text>
            <v-spacer />

            <v-card-actions>
              <v-spacer />

              <v-btn
                color="green darken-1"
                text
                @click="joinDialog = false"
              >
                Cancel
              </v-btn>

              <v-btn
                color="green darken-1"
                text
                @click="joinConference()"
              >
                Join
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-tooltip v-if="!session" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="!session"
              small
              v-on="on"
              @click="joinDialog = true"
            >
              <v-icon>fa-phone-volume</v-icon>
            </v-btn>
          </template>
          <span>Join conference</span>
        </v-tooltip>
        <v-tooltip v-if="session" top>
          <template v-slot:activator="{ on }">
            <v-btn
              v-if="session"
              small
              v-on="on"
              @click="leave()"
            >
              <v-icon>fa-power-off</v-icon>
            </v-btn>
          </template>
          <span>Hang up</span>
        </v-tooltip>
      </v-col>
    </v-row>
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
          <v-card-actions>
            <v-tooltip v-if="handleDTO && handleDTO.isLocal && handleDTO.stream" top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="handleDTO && handleDTO.isLocal && handleDTO.stream"
                  small
                  v-on="on"
                  @click="unpublish(handleDTO)"
                >
                  <v-icon>fa-minus-circle</v-icon>
                </v-btn>
              </template>
              <span>Unpublish</span>
            </v-tooltip>
            <v-tooltip v-if="handleDTO && handleDTO.isLocal && !handleDTO.stream" top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-if="handleDTO && handleDTO.isLocal && !handleDTO.stream"
                  small
                  v-on="on"
                  @click="publish(handleDTO)"
                >
                  <v-icon>fa-bullhorn</v-icon>
                </v-btn>
              </template>
              <span>Publish</span>
            </v-tooltip>
          </v-card-actions>
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
    members: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      session: null,
      join: {
        type: 'Join', // [ "Join" , "Publish" ]
        sendVideo: true,
        sendAudio: true
      },
      joinDialog: false
    }
  },
  mounted () {
    this.$nextTick(() => {
      document.addEventListener('beforeunload', this.leave)
    })
  },
  beforeDestroy () {
    if (this.session) {
      this.$store.dispatch('api/janus/session/destroy', { sessionDTO: this.session })
    }
  },
  destroyed () {
    document.removeEventListener('beforeunload', this.leave)
  },
  methods: {
    getMember (username) {
      return this.members.find(u => u.username === username) || { }
    },
    async joinConference () {
      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const janusPayload = {
        janus: {
          roomid: this.room.media.roomid,
          plugin: config.janusSettings.plugins.videoroom,
          display: this.user && this.user.username ? this.user.username : 'Anonymous',
          sendVideo: this.join.sendVideo,
          sendAudio: this.join.sendAudio
        },
        media: this.room.media
      }
      console.log(janusPayload.janus)
      janusPayload.media.room = janusPayload.media.roomid
      janusPayload.media.request = 'create'
      this.session = await this.$store.dispatch('janus/join', janusPayload)
    },
    async publish (handleDTO) {
      await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO })
        .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO, jsep }))
    },
    async unpublish (handleDTO) {
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO })
    },
    async leave () {
      if (this.session) {
        await this.$store.dispatch('api/janus/session/destroy', { sessionDTO: this.session })
        this.session = null
      }
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
