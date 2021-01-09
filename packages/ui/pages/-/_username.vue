<template>
  <v-layout>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="4"
      >
        <v-card class="elevation-12">
          <v-card-title
            class="justify-center"
          >
            <v-badge
              :color="isInCall() ? 'red' : isOnline() ? 'green' : 'grey'"
              bordered
              bottom
              left
              avatar
              overlap
              offset-x="30"
              offset-y="30"
            >
              <template v-if="isInCall(user._id)" #badge>
                <v-avatar v-if="isInCall(user._id)" size="12">
                  <v-icon size="7" style="margin-bottom: 6px">
                    fa fa-phone
                  </v-icon>
                </v-avatar>
              </template>

              <v-avatar
                class="profile"
                color="grey"
                size="164"
                align="center"
                justify="center"
              >
                <img
                  v-if="user && user.avatar_url"
                  :src="user.avatar_url"
                  alt="Avatar"
                >
                <v-icon
                  v-else
                >
                  fa-user
                </v-icon>
              </v-avatar>
            </v-badge>
          </v-card-title>

          <v-card-text
            align="center"
            justify="center"
          >
            {{ user.username }}
          </v-card-text>
          <v-card-actions>
            &nbsp;
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
export default {
  data () {
    return {
      user: {
        _id: null,
        username: null
      }
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['api/auth/isAuthenticated']
    },
    isActivated () {
      return this.$store.getters['api/auth/isActivated']
    }
  },
  async created () {
    const response = await this.$store.dispatch('api/auth/get', this.$route.params.username)
    if (!response.hasError) {
      this.user = response.result
    }
  },
  methods: {
    isOnline () {
      return this.$store.getters['api/auth/isOnline'](this.user._id)
    },
    isInCall () {
      return this.$store.getters['api/room/calls/isUserInCall'](this.user._id)
    }
  }
}
</script>

<style scoped>
* >>> .v-badge__badge {
  height: 12px;
  min-width: 12px;
  padding: 0px;
}
* >>> .v-badge--bordered .v-badge__badge::after {
  border-width: 1px;
}
</style>
