<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <v-card v-if="message">
      <v-card-title class="headline">
        Warning
      </v-card-title>
      <v-card-text>Are you sure you want to delete this message?</v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" outlined @click="no()">
          No
        </v-btn>
        <v-btn color="primary" outlined @click="yes()">
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
    message: {
      type: Object,
      default: null
    }
  },
  methods: {
    no () {
      this.$emit('messageDeleteCancel')
    },
    yes () {
      this.$emit('messageDelete', this.message)
    }
  }
}
</script>
