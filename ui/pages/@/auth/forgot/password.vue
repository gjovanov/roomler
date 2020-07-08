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
                label="Email"
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
              @click="reset()"
            >
              Reset pasword
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
      email: null,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid'
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
        handleSuccess('Password was reset. Please check your email for further instructions.', this.$store.commit)
        this.$router.push({ path: '/' })
      }
    }
  }
}
</script>
