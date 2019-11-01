<template>
  <v-menu
    v-model="menu"
    open-on-hover
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-btn
        text
        dark
        v-on="on"
      >
        <v-icon>fa-ellipsis-h</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="add()">
        <v-list-item-title>
          <v-icon>fa-plus</v-icon> Add nested room
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item @click="edit()">
        <v-list-item-title>
          <v-icon>fa-edit</v-icon> Rename
        </v-list-item-title>
      </v-list-item>
      <v-divider />
      <v-list-item @click="removeConsent()">
        <v-list-item-title>
          <v-icon>fa-trash</v-icon> Delete room
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  props: {
    room: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: false
    }
  },
  methods: {
    add () {
      this.$emit('add', this.room)
    },
    edit () {
      this.$emit('edit', this.room)
    },
    removeConsent () {
      this.$emit('removeConsent', this.room)
    }
  }
}
</script>
