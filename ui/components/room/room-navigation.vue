<template>
  <v-toolbar
    v-if="room"
    tile
    dense
    style="background-color: #363636; height: 56px;"
  >
    <join-dialog :open="joinDialog" @join="join" @cancel="joinDialog = false" />
    <publish-dialog :open="publishDialog" @publish="publish" @cancel="publishDialog = false" />
    <extension-dialog :open="extensionDialog" @cancel="extensionDialog = false" />
    <v-toolbar-title>
      {{ conferenceRoom ? conferenceRoom.name.toUpperCase() : room.name.toUpperCase() }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}`"
          v-on="on"
        >
          <v-icon small>
            fa-comments
          </v-icon>
        </v-btn>
      </template>
      <span>Chat</span>
    </v-tooltip>

    <v-tooltip v-if="!session" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="!session"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="joinDialog = true"
        >
          <v-icon small>
            fa-phone-volume
          </v-icon>
        </v-btn>
      </template>
      <span>Join conference</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle && localHandle.stream" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && localHandle.stream"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="unpublish()"
        >
          <v-icon small>
            fa-stop-circle
          </v-icon>
        </v-btn>
      </template>
      <span>Unpublish</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.screen"
          class="v-btn--active"
          v-on="on"
          @click="toggleScreen()"
        >
          <v-icon v-if="!localHandle.screen">
            screen_share
          </v-icon>
          <v-icon v-if="localHandle.screen">
            stop_screen_share
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.screen">Stop sharing screen</span>
      <span v-if="!localHandle.screen">Start sharing screen</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.video"
          class="v-btn--active"
          v-on="on"
          @click="toggleVideo()"
        >
          <v-icon v-if="localHandle.video">
            fa-video
          </v-icon>
          <v-icon v-if="!localHandle.video">
            fa-video-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.video">Stop video</span>
      <span v-if="!localHandle.video">Start video</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle"
          tile
          small
          :text="localHandle.audio"
          class="v-btn--active"
          v-on="on"
          @click="toggleAudio()"
        >
          <v-icon v-if="localHandle.audio">
            fa-microphone
          </v-icon>
          <v-icon v-if="!localHandle.audio">
            fa-microphone-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="localHandle.audio">Mute microphone</span>
      <span v-if="!localHandle.audio">Unmute microphone</span>
    </v-tooltip>

    <v-tooltip v-if="localHandle && !localHandle.stream" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="localHandle && !localHandle.stream"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="publishDialog = true"
        >
          <v-icon small>
            fa-bullhorn
          </v-icon>
        </v-btn>
      </template>
      <span>Publish</span>
    </v-tooltip>

    <v-tooltip v-if="session" bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="session"
          color="red"
          tile
          small
          class="v-btn--active"
          v-on="on"
          @click="leave()"
        >
          <v-icon small>
            fa-phone-slash
          </v-icon>
        </v-btn>
      </template>
      <span>Hang up</span>
    </v-tooltip>

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}/peers`"
          v-on="on"
        >
          <v-icon small>
            fa-users
          </v-icon>
        </v-btn>
      </template>
      <span>Manage peers</span>
    </v-tooltip>

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          v-show="!session"
          tile
          small
          class="v-btn--active"
          :to="`/${room.path}/settings`"
          v-on="on"
        >
          <v-icon small>
            fa-cog
          </v-icon>
        </v-btn>
      </template>
      <span>Manage settings</span>
    </v-tooltip>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          :text="panelRight"
          class="v-btn--active"
          @click="toggle('right')"
          v-on="on"
        >
          <v-icon v-if="panelRight" small>
            fa-caret-square-right
          </v-icon>
          <v-icon v-if="!panelRight" small>
            fa-caret-square-left
          </v-icon>
        </v-btn>
      </template>
      <span v-if="panelRight">Hide right panel</span>
      <span v-if="!panelRight">Show right panel</span>
    </v-tooltip>
  </v-toolbar>
</template>

<script>

import JoinDialog from '@/components/conference/join-dialog'
import PublishDialog from '@/components/conference/publish-dialog'
import ExtensionDialog from '@/components/conference/extension-dialog'

export default {
  components: {
    JoinDialog,
    PublishDialog,
    ExtensionDialog
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
    session: {
      type: Object,
      default: null
    },
    conferenceRoom: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      joinDialog: false,
      publishDialog: false,
      extensionDialog: false
    }
  },
  computed: {
    panelLeft () {
      return this.$store.state.panel.left
    },
    panelRight () {
      return this.$store.state.panel.right
    },
    panelChat () {
      return this.$store.state.panel.chat
    },
    panelConference () {
      return this.$store.state.panel.conference
    },
    localHandle () {
      return this.$store.getters['api/conference/localHandle']
    }
  },
  methods: {
    toggle (panel) {
      this.$store.commit('panel/toggle', panel)
    },
    async join (media) {
      await this.$router.push({ path: `/${this.room.path}` })
      this.$store.commit('panel/set', { panel: 'left', value: false }, { root: true })

      this.joinDialog = false
      const config = this.$store.state.api.config.config
      const janusPayload = {
        janus: {
          roomid: this.room.media.roomid,
          plugin: config.janusSettings.plugins.videoroom,
          display: this.user && this.user.username ? this.user.username : 'Anonymous',
          video: media.video,
          audio: media.audio,
          screen: media.screen
        },
        media: this.room.media
      }
      janusPayload.media.room = janusPayload.media.roomid
      janusPayload.media.request = 'create'
      this.$store.dispatch('api/conference/join', { janusPayload, room: this.room })
    },
    async toggleScreen () {
      if (!this.$Janus.isExtensionEnabled()) {
        this.extensionDialog = true
      } else {
        try {
          const media = {
            audio: this.localHandle.audio,
            video: false,
            screen: !this.localHandle.screen
          }
          this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
          const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
          this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
        } catch (e) {
          console.log(e)
        }
      }
    },
    async toggleVideo () {
      try {
        const media = {
          audio: this.localHandle.audio,
          video: !this.localHandle.video,
          screen: false
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
      } catch (e) {
        console.log(e)
      }
    },
    async toggleAudio () {
      try {
        const media = {
          audio: !this.localHandle.audio,
          video: this.localHandle.video,
          screen: this.localHandle.screen
        }
        this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
        const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
      } catch (e) {
        console.log(e)
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
      const jsep = await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
      this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep })
    },
    async unpublish () {
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media: { audio: false, video: false, screen: false, data: false } })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO: this.localHandle })
    },
    leave () {
      this.$store.commit('panel/set', { panel: 'left', value: true }, { root: true })
      this.$store.dispatch('api/conference/leave')
    }
  }
}
</script>
