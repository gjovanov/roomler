<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card v-if="room && user">
      <v-card-title class="headline">
        Danger
      </v-card-title>
      <v-card-text>You are about to transfer the ownership of '{{ room.path }}' to '{{ user.username }}'. You will still keep a moderator role of this room, but the owner will become '{{ user.username }}'. Are you sure you want to proceed? </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          class="ma-3"
          outlined
          @click="no()"
        >
          No
        </v-btn>
        <v-spacer />

        <v-btn
          color="primary"
          class="ma-3"
          outlined
          @click="yes()"
        >
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default: null
    },
    user: {
      type: Object,
      default: null
    }
  },
  methods: {
    no () {
      this.$emit('transferCancel', this.user)
    },
    yes () {
      this.$emit('toOwner', this.user)
    }
  }
}
</script>
