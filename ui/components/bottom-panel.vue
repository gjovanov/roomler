<template>
  <v-bottom-navigation
    v-model="bottomNav"
    absolute
    grow
    style="background-color: #363636;"
  >
    <v-btn value="privacy" to="/tos/privacy">
      <span>Privacy terms</span>
      <v-icon>fa fa-user-shield</v-icon>
    </v-btn>
    <v-btn value="source" href="https://roomler.live/gjovanov/join">
      <span>Ask me anything</span>
      <v-icon>fa fa-phone</v-icon>
    </v-btn>
    <v-btn value="source" href="https://github.com/gjovanov/roomler">
      <span>Source code</span>
      <v-icon>fab fa-github</v-icon>
    </v-btn>
    <v-btn value="source" href="https://twitter.com/gjovanov">
      <span>Twitter</span>
      <v-icon>fab fa-twitter</v-icon>
    </v-btn>
    <v-btn value="source" href="https://www.linkedin.com/in/gjovanov">
      <span>Linked In</span>
      <v-icon>fab fa-linkedin</v-icon>
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
