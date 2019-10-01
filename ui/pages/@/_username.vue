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
          <v-card-title>
            {{ username }}
            <v-avatar
              class="profile"
              color="grey"
              size="164"
            >
              <img
                v-if="person && person.photoUrl"
                alt="Avatar"
                :src="person.photoUrl"
              >
              <v-icon
                v-else
              >
                person
              </v-icon>
            </v-avatar>
          </v-card-title>

          <v-card-text>
            &nbsp;
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
      username: null
    }
  },
  computed: {
    isAuthenticated () {
      return this.$store.getters['auth/isAuthenticated']
    },
    isActivated () {
      return this.$store.getters['auth/isActivated']
    },
    user () {
      return this.$store.state.auth.user
    },
    person () {
      return this.$store.state.auth.person
    }
  },
  mounted () {
    this.username = this.$route.params.username
  }
}
</script>
