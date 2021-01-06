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
                v-model="email"
                :rules="emailRules"
                :label="$t('pages.@.auth.forgot.password.email')"
                name="email"
                autocomplete="on"
                required
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              :disabled="!valid"
              color="primary"
              elevation="0"
              @click="reset()"
            >
              {{ $t('pages.@.auth.forgot.password.resetPassword') }}
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
    const self = this
    return {
      valid: true,
      email: null,
      emailRules: [
        v => !!v || self.$t('pages.@.auth.forgot.password.emailRequired'),
        v => /\S+@\S+\.\S+/.test(v) || self.$t('pages.@.auth.forgot.password.emailValid')
      ]
    }
  },
  methods: {
    async reset () {
      if (this.$refs.form.validate()) {
        await this.$store.dispatch('api/auth/reset', {
          email: this.email,
          type: 'password_reset'
        })
        handleSuccess(this.$t('pages.@.auth.forgot.password.passwordResetMessage'), this.$store.commit)
        this.$router.push({ path: this.localePath({ name: 'index' }) })
      }
    }
  }
}
</script>
