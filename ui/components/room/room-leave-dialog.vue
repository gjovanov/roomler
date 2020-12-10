<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">
          {{ $t('comps.room.warning') }}
        </v-card-title>
        <v-card-text>{{ $t('comps.room.leaveConfirmation') }}</v-card-text>
        <v-card-actions>
          <v-btn
            color="grey"
            class="ma-3"
            outlined
            @click="no()"
          >
            {{ $t('comps.room.cancel') }}
          </v-btn>
          <v-spacer />

          <v-btn
            color="primary"
            class="ma-3"
            outlined
            @click="yes()"
          >
            {{ $t('comps.room.leave') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
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
      this.$emit('leaveCancel')
    },
    yes () {
      this.$emit('leave', this.room, this.user)
    }
  }
}
</script>
