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
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="username"
                :rules="usernameRules"
                label="New username"
                name="username"
                autocomplete="on"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="change()"
            >
              Change username
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

      token: null,
      email: null,

      username: null,
      usernameRules: [
        v => !!v || 'Username is required',
        v => (v && v.length >= 6) || 'Username must be at least 6 characters',
        v => /^[a-zA-Z0-9_-]+$/.test(v) || 'Username must be composed of only letters, numbers and - or _ character'
      ]
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
    if (this.$route.query.token) {
      this.token = this.$route.query.token
    }
  },
  methods: {
    async change () {
      const self = this
      if (this.$refs.form.validate()) {
        const response = await this.$store.dispatch('api/auth/updateUsername', {
          email: this.email.toLowerCase(),
          token: this.token,
          username: this.username
        })
        if (!response.hasError) {
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('connectWebSocket')
          handleSuccess('Your username was successfully changed.', this.$store.commit)
          self.$router.push({ path: self.localePath({ name: 'index' }) })
        }
      }
    }
  }
}
</script>
