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
                :label="$t('pages.@.auth.login.username')"
                name="username"
                autocomplete="on"
                required
              />
              <v-spacer />
              <v-text-field
                v-model="password"
                :rules="[...passwordRules]"
                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                :type="showPassword ? 'text' : 'password'"
                :label="$t('pages.@.auth.login.password')"
                name="password"
                autocomplete="on"
                :hint="$t('pages.@.auth.login.passwordLimit')"
                @click:append="showPassword = !showPassword"
              />
              <v-spacer />
              <h4>
                {{ $t('pages.@.auth.login.loggingIn') }}
                <nuxt-link :to="localePath({ name: 'tos-terms' })">
                  {{ $t('pages.@.auth.login.terms') }}
                </nuxt-link>
              </h4>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-container class="ma-0 pt-0 pb-0">
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    x-small
                    class="mb-8"
                    elevation="0"
                    :to="localePath({ name: '--auth-forgot-password' })"
                  >
                    {{ $t('pages.@.auth.login.forgotPassword') }}
                  </v-btn>
                  <v-btn
                    x-small
                    class="mb-8"
                    elevation="0"
                    :to="localePath({ name: '--auth-forgot-username' })"
                  >
                    {{ $t('pages.@.auth.login.forgotUsername') }}
                  </v-btn>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12" sm="12">
                  <v-btn
                    :disabled="!valid"
                    color="primary"
                    class="mb-8"
                    elevation="0"
                    @click="login()"
                  >
                    {{ $t('pages.@.auth.login.login') }}
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

export default {
  middleware: 'anonymous',
  data () {
    const self = this
    return {
      valid: true,

      username: null,
      usernameRules: [
        v => !!v || self.$t('pages.@.auth.login.usernameRequired'),
        v => (v && v.length >= 6) || self.$t('pages.@.auth.login.usernameLimit'),
        v => /^[a-zA-Z0-9_-]+$/.test(v) || self.$t('pages.@.auth.login.usernameChars')
      ],

      password: null,
      passwordRules: [
        v => !!v || self.$t('pages.@.auth.login.passwordRequired'),
        v => (v && v.length >= 8) || self.$t('pages.@.auth.login.passwordLimit')
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
          await this.$store.dispatch('api/invite/acceptPendingInvites')
          await this.$store.dispatch('connectWebSocket')
          self.$router.push({ path: self.localePath({ name: 'index' }) })
        }
      }
    }
  }
}
</script>

<style>
  .fab-container {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>
