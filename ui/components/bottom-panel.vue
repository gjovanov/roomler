<template>
  <v-bottom-navigation
    v-model="bottomNav"
    padless
    fixed
    absolute
    shift
    style="background-color: #363636;"
  >
    <v-btn value="privacy" to="/tos/privacy">
      Privacy
      <v-icon>fa-user-secret</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script>
export default {
  data () {
    return {
      bottomNav: ''
    }
  }
}
</script>
