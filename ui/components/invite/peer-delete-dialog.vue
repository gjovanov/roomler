<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card v-if="room && user">
      <v-card-title class="headline">
        {{ $t('comps.room.warning') }}
      </v-card-title>
      <v-card-text>
        <p>
          {{ $t('comps.invite.removeParticipant1') }} <strong>{{ user.username }}</strong></strong>
        </p>
        <p>
          {{ $t('comps.invite.removeParticipant2') }} <strong>{{ room.path }}</strong>
        </p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          class="ma-3"
          outlined
          @click="no()"
        >
          {{ $t('comps.invite.cancel') }}
        </v-btn>
        <v-spacer />

        <v-btn
          color="primary"
          class="ma-3"
          outlined
          @click="yes()"
        >
          {{ $t('comps.invite.removeParticipant') }}
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
      this.$emit('peerDeleteCancel')
    },
    yes () {
      this.$emit('peerDelete', this.user)
    }
  }
}
</script>
