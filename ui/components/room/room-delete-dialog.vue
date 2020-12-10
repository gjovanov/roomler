<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="400">
      <v-form ref="roomDeleteForm" v-model="valid" lazy-validation>
        <v-card v-if="room">
          <v-card-title class="headline">
            {{ $t('comps.room.warning') }}
          </v-card-title>
          <v-card-text>
            <p>
              {{ $t('comps.room.typeRoomName') }}: <strong>{{ room.short_name }}</strong>
            </p>
            <p v-if="room.children && room.children.length">
              <strong>{{ $t('comps.room.warning') }}:</strong> {{ $t('comps.room.deleteChildrenRooms') }}
            </p>
            <p>
              {{ $t('comps.room.operationNotReversable') }}
            </p>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              :label="$t('comps.room.roomName')"
              :placeholder="$t('comps.room.roomNamePlaceholder')"
              name="name"
              autocomplete="on"
              dense
              outlined
              required
              @keydown.enter.prevent="yes()"
            />
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="grey"
              outlined
              class="ma-3"
              @click="no()"
            >
              {{ $t('comps.room.cancel') }}
            </v-btn>
            <v-spacer />

            <v-btn
              color="primary"
              outlined
              :disabled="!valid"
              class="ma-3"
              @click="yes()"
            >
              {{ $t('comps.room.delete') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
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
    }
  },
  data () {
    const self = this
    return {
      valid: false,
      name: null,
      nameRules: [
        v => !!v || self.$t('comps.room.roomNameRequired'),
        v => this.room.short_name === this.name || self.$t('comps.room.roomNameMatch')
      ]
    }
  },
  methods: {
    no () {
      this.$emit('removeCancel', this.room)
      this.name = null
    },
    yes () {
      if (this.$refs.roomDeleteForm.validate()) {
        this.$emit('remove', this.room)
        this.name = null
      }
    }
  }
}
</script>
