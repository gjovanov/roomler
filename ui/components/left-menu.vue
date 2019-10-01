<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    expand-on-hover
    clipped
  >
    <v-subheader class="mt-4 grey--text text--darken-1">
      Rooms
    </v-subheader>
    <v-list dense>
      <v-list-item
        v-for="room in rooms"
        :key="room._id"
        @click="goToRoom(room.name)"
      >
        <v-list-item-action>
          <v-icon>fa-box-open</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ room.name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>

export default {
  props: {
    drawer: {
      type: Boolean,
      default: true
    },
    mini: {
      type: Boolean,
      default: true
    },
    rooms: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    goToRoom (name) {
      this.$router.push({ path: `/${name}` })
    }
  }
}

</script>
