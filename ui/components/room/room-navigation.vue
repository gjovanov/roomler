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
      {{ room.name.toUpperCase() }}
    </v-toolbar-title>

    <v-spacer />

    <v-tooltip bottom left>
      <template v-slot:activator="{ on }">
        <v-btn
          v-if="room"
          tile
          small
          :text="!panelChat"
          class="v-btn--active"
          :to="`/${room.path}`"
          v-on="on"
        >
          <v-icon v-if="panelChat" small>
            fa-comments
          </v-icon>
          <v-icon v-if="!panelChat" small>
            fa-comment-slash
          </v-icon>
        </v-btn>
      </template>
      <span v-if="panelChat">Hide chat</span>
      <span v-if="!panelChat">Show chat</span>
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
            fa-sign-in-alt
          </v-icon>
        </v-btn>
      </template>
      <span>Join conference</span>
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
            fa-sign-out-alt
          </v-icon>
        </v-btn>
      </template>
      <span>Hang up</span>
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
            fa-minus-circle
          </v-icon>
        </v-btn>
      </template>
      <span>Unpublish</span>
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
    join (media) {
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
    async shareScreen () {
      if (!this.$Janus.isExtensionEnabled()) {
        this.extensionDialog = true
      } else {
        this.$store.commit('api/janus/videoroom/updates/setMedia', {
          handleDTO: this.localHandle,
          media: {
            audio: false,
            video: false,
            screen: true
          }
        })
        await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
          .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep }))
      }
    },
    async publish (media) {
      this.publishDialog = false
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media })
      await this.$store.dispatch('api/janus/handle/createOffer', { handleDTO: this.localHandle })
        .then(jsep => this.$store.dispatch('api/janus/videoroom/api/configure', { handleDTO: this.localHandle, jsep }))
    },
    async unpublish () {
      this.$store.commit('api/janus/videoroom/updates/setMedia', { handleDTO: this.localHandle, media: { audio: false, video: false, screen: false, data: false } })
      await this.$store.dispatch('api/janus/videoroom/api/unpublish', { handleDTO: this.localHandle })
    },
    leave () {
      this.$store.dispatch('api/conference/leave')
    }
  }
}
</script>
