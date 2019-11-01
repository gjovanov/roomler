<template>
  <v-layout>
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
                v-model="email"
                :rules="emailRules"
                label="Email"
                name="email"
                autocomplete="on"
                required
              />
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
              <v-spacer />
              <v-text-field
                v-model="passwordConfirm"
                :rules="[...passwordConfirmRules, passwordConfirmationRule]"
                label="Password confirm"
                name="passwordConfirm"
                autocomplete="on"
                :append-icon="showPasswordConfirm ? 'visibility' : 'visibility_off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                hint="At least 8 characters"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="mb-8"
              @click="register()"
            >
              Register
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

<script>
import {
  handleSuccess
} from '@/services/ajax-handlers'
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

      email: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid'
      ],

      password: null,
      passwordRules: [
        v => !!v || 'Password is required',
        v => (v && v.length >= 8) || 'Password must be at least 8 characters'
      ],
      showPassword: false,

      passwordConfirm: null,
      passwordConfirmRules: [
        v => !!v || 'Password confirm is required',
        v => (v && v.length >= 8) || 'Password confirm must be at least 8 characters'
      ],
      showPasswordConfirm: false
    }
  },
  computed: {
    passwordConfirmationRule () {
      return () => (this.password === this.passwordConfirm) || 'Password must match'
    }
  },
  created () {
    if (this.$route.query.email) {
      this.email = this.$route.query.email
    }
    if (this.$route.query.username) {
      this.username = this.$route.query.username
    }
  },
  methods: {
    async register () {
      const self = this
      if (this.$refs.form.validate()) {
        const response = await this.$store.dispatch('api/auth/register', {
          username: this.username,
          email: this.email.toLowerCase(),
          password: this.password,
          passwordConfirm: this.passwordConfirm
        })
        if (!response.hasError) {
          await this.$store.dispatch('connectWebSocket')
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('api/room/getAll')
          handleSuccess('Your account was successfully created. Check your email on how to activate your account.', this.$store.commit)
          self.$router.push({ path: '/' })
        }
      }
    }
  }
}
</script>
