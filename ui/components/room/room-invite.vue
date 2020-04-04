<template>
  <v-card
    v-if="room"
    color="white"
    hover
    light
  >
    <v-img
      class="accent--text align-end"

      src="/friends.png"
    >
      <v-card-title class="justify-center">
        It's more fun with friends
      </v-card-title>
    </v-img>
    <v-card-text>
      Let's invite some peers to join this room.
    </v-card-text>
    <v-card-actions
      align="center"
      justify="center"
    >
      <v-container>
        <v-row v-if="peers && peers.length">
          <v-col cols="12">
            <v-btn :to="`/${room.path}/peers?add`" dark block outlined class="red">
              <v-icon>fa-users</v-icon> &nbsp; Add existing peers
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn :to="`/${room.path}/peers?invite`" dark block outlined class="primary">
              <v-icon>fa-paper-plane</v-icon> &nbsp; Invite new peers
            </v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn :to="`/${room.path}/peers?link`" dark block outlined class="orange">
              <v-icon>fa-link</v-icon> &nbsp; Share room link
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
  }
}
</script>
