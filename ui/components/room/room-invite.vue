<template>
  <v-card
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
      <v-btn :to="`/${room.path}/peers?invite`" dark block outlined class="primary">
        <v-icon>fa-users</v-icon> &nbsp; Invite peers
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  props: {
    room: {
      type: Object,
      default: null,
      required: true
    }
  }
}
</script>
