<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    expand-on-hover
    clipped
  >
    <v-list dense>
      <v-list-item
        v-for="item in items"
        :key="item.text"
        @click="click"
      >
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            {{ item.text }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-subheader class="mt-4 grey--text text--darken-1">
        SUBSCRIPTIONS
      </v-subheader>
      <v-list>
        <v-list-item
          v-for="item in items2"
          :key="item.text"
          @click="click"
        >
          <v-list-item-avatar>
            <img
              :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`"
              alt=""
            >
          </v-list-item-avatar>
          <v-list-item-title v-text="item.text" />
        </v-list-item>
      </v-list>
      <v-list-item
        class="mt-4"
        @click="click"
      >
        <v-list-item-action>
          <v-icon color="grey darken-1">
            mdi-plus-circle-outline
          </v-icon>
        </v-list-item-action>
        <v-list-item-title class="grey--text text--darken-1">
          Browse Channels
        </v-list-item-title>
      </v-list-item>
      <v-list-item @click="click">
        <v-list-item-action>
          <v-icon color="grey darken-1">
            mdi-settings
          </v-icon>
        </v-list-item-action>
        <v-list-item-title class="grey--text text--darken-1">
          Manage Subscriptions
        </v-list-item-title>
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
    }
  },
  data: () => ({
    items: [
      { icon: 'trending_up', text: 'Most Popular' },
      { icon: 'subscriptions', text: 'Subscriptions' },
      { icon: 'history', text: 'History' },
      { icon: 'featured_play_list', text: 'Playlists' },
      { icon: 'watch_later', text: 'Watch Later' }
    ],
    items2: [
      { picture: 18, text: 'Joseph' },
      { picture: 38, text: 'Apple' },
      { picture: 48, text: 'Xbox Ahoy' },
      { picture: 58, text: 'Nokia' },
      { picture: 78, text: 'MKBHD' }
    ]
  }),
  methods: {
    click () {

    }
  }
}

</script>
