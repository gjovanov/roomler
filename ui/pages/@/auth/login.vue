<template>
  <v-layout fill-height>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="8"
        md="6"
        lg="4"
      >
        <v-card class="elevation-12">
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="Username"
                name="username"
                autocomplete="on"
                required
              />
              <v-spacer />
              <v-text-field
                v-model="password"
                :rules="[...passwordRules]"
                label="Password"
                name="password"
                autocomplete="on"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                hint="At least 8 characters"
                @click:append="showPassword = !showPassword"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mb-8"
              @click="login()"
            >
              Login
            </v-btn>
            <v-spacer />
            <v-btn
              right
              x-small
              class="mb-8"
              to="/@/auth/forgot/password"
            >
              Forgot password
            </v-btn>
            <v-btn
              right
              x-small
              class="mb-8"
              to="/@/auth/forgot/username"
            >
              Forgot username
            </v-btn>
            <v-spacer />
            <v-btn
              fab
              absolute
              left
              bottom
              dark
              small
              color="blue darken-3"

              :href="'/oauth/login/facebook'"
            >
              <v-icon>
                fab fa-facebook
              </v-icon>
            </v-btn>
            <v-btn
              fab
              absolute
              left
              bottom
              dark
              small
              color="blue lighten-1"
              :style="`margin-left: ${1 * 48}px !important;`"
              :href="'/oauth/login/twitter'"
            >
              <v-icon>
                fab fa-twitter
              </v-icon>
            </v-btn>
            <v-btn
              fab
              absolute
              left
              bottom
              dark
              small
              color="grey darken-1"
              :style="`margin-left: ${2 * 48}px !important;`"
              :href="'/oauth/login/github'"
            >
              <v-icon>
                fab fa-github
              </v-icon>
            </v-btn>
            <v-btn
              fab
              absolute
              left
              bottom
              dark
              small
              color="teal darken-4"
              :style="`margin-left: ${3 * 48}px !important;`"
              :href="'/oauth/login/linkedin'"
            >
              <v-icon>
                fab fa-linkedin
              </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-layout>
</template>

<style>
  .fab-container {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>

<script>
export default {
  data () {
    return {
      valid: true,

      username: null,
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 6) || 'Username must be at least 6 characters',
        v => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username must be composed of only letters, numbers and - or _ character'
      ],

      password: null,
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters'
      ],
      showPassword: false
    }
  },
  methods: {
    async login () {
      const self = this
      if (this.$refs.form.validate()) {
        const response = await this.$store.dispatch('api/auth/login', {
          username: this.username,
          password: this.password
        })
        if (!response.hasError) {
          await this.$store.dispatch('connectWebSocket')
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('api/room/getAll')
          self.$router.push({ path: '/' })
        }
      }
    }
  }
}
</script>
