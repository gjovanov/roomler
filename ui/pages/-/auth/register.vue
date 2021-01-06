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
                :label="$t('pages.@.auth.register.username')"
                name="username"
                autocomplete="on"
                required
              />
              <v-spacer />
              <v-text-field
                v-model="email"
                :rules="emailRules"
                :label="$t('pages.@.auth.register.email')"
                name="email"
                autocomplete="on"
                required
              />
              <v-text-field
                v-model="password"
                :rules="[...passwordRules]"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                :label="$t('pages.@.auth.register.password')"
                name="password"
                autocomplete="on"
                :hint="$t('pages.@.auth.register.passwordLimit')"
                @click:append="showPassword = !showPassword"
              />
              <v-spacer />
              <v-text-field
                v-model="passwordConfirm"
                :rules="[...passwordConfirmRules, passwordConfirmationRule]"
                :append-icon="showPasswordConfirm ? 'visibility' : 'visibility_off'"
                :type="showPasswordConfirm ? 'text' : 'password'"
                :label="$t('pages.@.auth.register.passwordConfirm')"
                name="passwordConfirm"
                autocomplete="on"
                :hint="$t('pages.@.auth.register.passwordLimit')"
                @click:append="showPasswordConfirm = !showPasswordConfirm"
              />
              <h4>
                {{ $t('pages.@.auth.register.signingUp') }}
                <nuxt-link :to="localePath({ name: 'tos-terms' })">
                  {{ $t('pages.@.auth.register.terms') }}
                </nuxt-link>
              </h4>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-container class="ma-0 pt-0 pb-0">
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="mb-6"
                    elevation="0"
                    @click="register()"
                  >
                    {{ $t('pages.@.auth.register.signup') }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
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
  middleware: 'anonymous',
  data () {
    const self = this
    return {
      valid: true,

      username: null,
      usernameRules: [
        v => !!v || self.$t('pages.@.auth.register.usernameRequired'),
        v => (v && v.length >= 6) || self.$t('pages.@.auth.register.usernameLimit'),
        v => /^[a-zA-Z0-9_-]+$/.test(v) || self.$t('pages.@.auth.register.usernameChars')
      ],

      email: null,
      emailRules: [
        v => !!v || self.$t('pages.@.auth.register.emailRequired'),
        v => /\S+@\S+\.\S+/.test(v) || self.$t('pages.@.auth.register.emailValid')
      ],

      password: null,
      passwordRules: [
        v => !!v || self.$t('pages.@.auth.register.passwordRequired'),
        v => (v && v.length >= 8) || self.$t('pages.@.auth.register.passwordLimit')
      ],
      showPassword: false,

      passwordConfirm: null,
      passwordConfirmRules: [
        v => !!v || self.$t('pages.@.auth.register.passwordConfirmRequired'),
        v => (v && v.length >= 8) || self.$t('pages.@.auth.register.passwordLimit')
      ],
      showPasswordConfirm: false
    }
  },
  computed: {
    passwordConfirmationRule () {
      const self = this
      return () => (this.password === this.passwordConfirm) || self.$t('pages.@.auth.register.passwordMatch')
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
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('connectWebSocket')
          handleSuccess(self.$t('pages.@.auth.register.accountCreatedMessage'), this.$store.commit)
          self.$router.push({ path: self.localePath({ name: 'index' }) })
        }
      }
    }
  }
}
</script>
