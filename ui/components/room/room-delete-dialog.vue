<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-form ref="roomDeleteForm" v-model="valid" lazy-validation>
        <v-card v-if="room">
          <v-card-title class="headline">
            Danger
          </v-card-title>
          <v-card-text>
            <p>
              Please type the name of your room to confirm deletion: <strong>{{ room.short_name }}</strong>
            </p>
            <p v-if="room.children && room.children.length">
              <strong>Warning:</strong> children rooms will be also deleted.
            </p>
            <p>
              This operation cannot be reverted!
            </p>
            <v-text-field
              v-model="name"
              :rules="nameRules"
              label="Room name"
              placeholder="Enter room name"
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
              No
            </v-btn>
            <v-spacer />

            <v-btn
              color="primary"
              outlined
              :disabled="!valid"
              class="ma-3"
              @click="yes()"
            >
              Yes
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
    return {
      valid: false,
      name: null,
      nameRules: [
        v => !!v || 'Room name is required',
        v => this.room.short_name === this.name || 'Room name must match the name of the room you are trying to delete'
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
