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
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
                label="Password"
                name="password"
                autocomplete="on"
                hint="At least 8 characters"
              />
              <v-spacer />
              <v-text-field
                v-model="passwordConfirm"
                :rules="[...passwordConfirmRules, passwordConfirmationRule]"
                :append-icon="showPasswordConfirm ? 'visibility' : 'visibility_off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
                label="Password confirm"
                name="passwordConfirm"
                autocomplete="on"
                hint="At least 8 characters"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              @click="register()"
              color="primary"
              class="mb-8"
            >
              Register
            </v-btn>
            <v-spacer />
            <oauth-buttons />
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
import OauthButtons from '@/components/oauth-buttons'
export default {
  components: {
    OauthButtons
  },
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
          await Promise.all([this.$store.dispatch('api/room/getAll'), this.$store.dispatch('api/auth/getPeers')])
          await this.$store.dispatch('connectWebSocket')
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          handleSuccess('Your account was successfully created. Check your email on how to activate your account.', this.$store.commit)
          self.$router.push({ path: '/' })
        }
      }
    }
  }
}
</script>
