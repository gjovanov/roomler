<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <div class="text-xs-center"/>
      <v-card>
        <v-card-title class="headline">
          Welcome to GottaGetRoom
        </v-card-title>
        <v-card-text>
          HI
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            flat
            nuxt
            to="/inspire"
          >
            Continue
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import * as Janus from '~/lib/janus'

export default {
  components: {
  },

  beforeMount () {
  }
}
</script>
