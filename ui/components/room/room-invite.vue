<template>
  <v-card
    v-if="room"
    color="white"
    elevation="4"
    hover
    light
  >
    <v-img
      class="accent--text align-end"
      src="/friends.png"
    />
    <v-card-text class="text-center">
      <h2>
        {{ $t('comps.room.moreFunWithFriends') }}
      </h2>
    </v-card-text>
    <v-card-actions
      align="center"
      justify="center"
    >
      <v-container>
        <v-row>
          <v-col cols="12">
            <v-btn
              :to="localePath({ name: 'room-peers', params: { room: `${room.path}` }, query: { invite: null } })"
              block
              outlined
              class="primary"
              :dark="!isDark"
              :light="isDark"
            >
              <v-icon>fa-paper-plane</v-icon> &nbsp; {{ $t('comps.room.inviteNew') }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row v-if="peers && peers.length > 1">
          <v-col cols="12">
            <v-btn
              :to="localePath({ name: 'room-peers', params: { room: `${room.path}` }, query: { add: null } })"
              block
              outlined
              class="orange darken-2"
              :dark="!isDark"
              :light="isDark"
            >
              <v-icon>fa-user-plus</v-icon> &nbsp; {{ $t('comps.room.addExisting') }}
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12">
            <v-btn
              :to="localePath({ name: 'room-peers', params: { room: `${room.path}` }, query: { link: null } })"
              block
              outlined
              class="orange lighten-2"
              :dark="!isDark"
              :light="isDark"
            >
              <v-icon>fa-link</v-icon> &nbsp; {{ $t('comps.room.shareLink') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    peers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  computed: {
    isDark () {
      return this.$vuetify.theme.dark
    }
  }
}
</script>
