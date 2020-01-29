<template>
  <v-card
    lg="12"
    md="12"
    class="pt-0 mt-0"
  >
    <v-card-title class="text-center">
      <h4 v-if="room" class="font-weight-bold basil--text">
        {{ room.name }}
      </h4>
    </v-card-title>

    <v-chip-group
      column
      active-class="primary--text"
    >
      <v-chip
        v-for="tag in room.tags"
        :key="tag"
        class="ma-2"
        outlined
      >
        {{ tag }}
      </v-chip>
    </v-chip-group>
    <v-spacer />

    <v-tabs
      v-model="tab"
      dark
      show-arrows
      icons-and-text
      grow
    >
      <v-tab
        v-for="item in tabs"
        :key="item.name"
        :to="item.to"
        nuxt
      >
        {{ item.name }}
        <v-icon>
          {{ item.icon }}
        </v-icon>
      </v-tab>
    </v-tabs>

    <nuxt-child />
  </v-card>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    return {
      tab: 0,
      tabs: [
        {
          name: 'Live',
          icon: 'fa-video',
          to: `/${this.$route.params.roomname}/live`
        },
        {
          name: 'Members',
          icon: 'fa-users',
          to: `/${this.$route.params.roomname}/members`
        },
        {
          name: 'Settings',
          icon: 'fa-cog',
          to: `/${this.$route.params.roomname}/settings`
        }
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  computed: {
    room () {
      return this.$store.getters['api/room/selectedRoom'](this.$route.params.roomname)
    }
  },
  methods: {
  }
}
</script>
