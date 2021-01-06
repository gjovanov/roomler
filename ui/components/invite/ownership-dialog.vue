<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card v-if="room && user">
      <v-card-title class="headline">
        {{ $t('comps.room.warning') }}
      </v-card-title>
      <v-card-text>
        <p>{{ $t('comps.invite.transferOwnership1') }} <strong>{{ room.path }}</strong> {{ $t('comps.invite.transferOwnership2') }} <strong>{{ user.username }}</strong>. {{ $t('comps.invite.transferOwnership3') }}</p>
        <p>{{ $t('comps.invite.transferOwnership4') }}</p>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          class="ma-3"
          outlined
          elevation="0"
          @click="no()"
        >
          {{ $t('comps.invite.cancel') }}
        </v-btn>
        <v-spacer />

        <v-btn
          color="primary"
          class="ma-3"
          outlined
          elevation="0"
          @click="yes()"
        >
          {{ $t('comps.invite.transferOwnership') }}
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
