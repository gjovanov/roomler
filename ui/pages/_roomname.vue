<template>
  <v-card
    background-color="basil"
    lg="12"
    md="12"
  >
    <v-card-title class="text-center">
      <h4 class="font-weight-bold basil--text">
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
      background-color="accent-4"
      dark
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
          name: 'Messages',
          icon: 'fa-envelope',
          to: `/${this.$route.params.roomname}/messages`
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
      return this.$store.state.api.room.rooms.find(r => r.name.toLowerCase() === this.$route.params.roomname.toLowerCase())
    }
  },
  methods: {
  }
}
</script>
