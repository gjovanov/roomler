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
                v-model="password"
                :rules="[...passwordRules]"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                label="New password"
                name="password"
                autocomplete="on"
                hint="At least 8 characters"
                @click:append="showPassword = !showPassword"
              />
              <v-spacer />
              <v-text-field
                v-model="passwordConfirm"
                :rules="[...passwordConfirmRules, passwordConfirmationRule]"
                :append-icon="showPasswordConfirm ? 'visibility' : 'visibility_off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                label="New password confirm"
                name="passwordConfirm"
                autocomplete="on"
                hint="At least 8 characters"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              @click="change()"
            >
              Change password
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
    if (this.$route.query.token) {
      this.token = this.$route.query.token
    }
  },
  methods: {
    async change () {
      const self = this
      if (this.$refs.form.validate()) {
        const response = await this.$store.dispatch('api/auth/updatePassword', {
          email: this.email.toLowerCase(),
          token: this.token,
          password: this.password,
          passwordConfirm: this.passwordConfirm
        })
        if (!response.hasError) {
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('connectWebSocket')
          handleSuccess('Your password was successfully changed.', this.$store.commit)
          self.$router.push({ path: self.localePath({ name: 'index' }) })
        }
      }
    }
  }
}
</script>
