<template>
  <client-only>
    <v-expansion-panels
      v-model="panel"
      accordion
      flat
      tile
      class="pa-0 ma-0"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>Basic info</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-switch
            v-model="room.is_open"
            :label="room.is_open ? 'Open' : 'Closed'"
            disabled
          />
          <v-spacer />
          <v-text-field
            v-model="room.name"
            label="Room name"
            name="name"
            autocomplete="on"
            dense
            outlined
            required
            disabled
          />
          <v-combobox
            v-model="room.tags"
            :items="room.tags"
            label="Tags"
            multiple
            chips
            disabled
          >
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                :disabled="data.disabled"
                @click:close="data.parent.selectItem(data.item)"
              >
                {{ data.item }}
              </v-chip>
            </template>
          </v-combobox>
          <v-spacer />
          <v-textarea
            v-model="room.description"
            label="Description"
            name="description"
            autocomplete="on"
            dense
            outlined
            disabled
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>
          Media
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-spacer />
          <v-text-field
            v-model="room.media.publishers"
            label="Publishers"
            name="media.publishers"
            type="number"
            class="mt-4"
            dense
            outlined
            required
            disabled
          />
          <v-spacer />
          <v-text-field
            v-model="room.media.bitrate"
            label="Bitrate"
            name="media.bitrate"
            type="number"
            dense
            outlined
            required
            disabled
          />
          <v-spacer />
          <v-text-field
            v-model="room.media.fir_freq"
            label="Fir Frequency"
            name="media.fir_freq"
            type="number"
            dense
            outlined
            required
            disabled
          />
          <v-spacer />
          <v-combobox
            v-model="roomAudioCodecs"
            :items="audiocodecs"
            label="Audio codecs"
            dense
            multiple
            outlined
            disabled
          />
          <v-spacer />
          <v-combobox
            v-model="roomVideoCodecs"
            :items="videocodecs"
            label="Video codecs"
            dense
            multiple
            outlined
            disabled
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-spacer />
      <v-btn
        color="primary"
        class="mt-4 mb-4 ml-4"
        :to="`/@/room/edit?room=${room.path}`"
      >
        Update
      </v-btn>
    </v-expansion-panels>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    const config = this.$store.state.api.config.config
    const defaults = config.dataSettings.room.defaults.media

    return {
      panel: 0,
      url: config.appSettings.env.URL,
      audiocodecs: defaults.audiocodec.split(','),
      videocodecs: defaults.videocodec.split(',')
    }
  },
  computed: {
    user () {
      return this.$store.state.api.auth.user
    },
    room () {
      return this.$store.state.api.room.room
    },
    roomAudioCodecs () {
      return this.room.media.audiocodec.split(',')
    },
    roomVideoCodecs () {
      return this.room.media.videocodec.split(',')
    }
  },
  created () {
    const selectedRoom = this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    this.$store.commit('api/room/setRoom', selectedRoom, { root: true })
  },
  async mounted () {
    if (!this.room) {
      await this.$router.push({ path: '/' })
    }
  }
}
</script>
