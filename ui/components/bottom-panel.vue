<template>
  <v-bottom-navigation
    v-model="bottomNav"
    absolute
    style="background-color: #363636;"
  >
    <v-btn x-small value="privacy" to="/tos/privacy" class="ma-0">
      <span>Privacy</span>
      <v-icon small>
        fa fa-user-shield
      </v-icon>
    </v-btn>
    <v-btn x-small value="reach-out" href="https://roomler.live/gjovanov/join" target="_blank" class="ma-0">
      <span>Support</span>
      <v-icon small>
        fa fa-phone
      </v-icon>
    </v-btn>
    <v-btn x-small value="source" href="https://github.com/gjovanov/roomler" target="_blank" class="ma-0">
      <span>Source</span>
      <v-icon small>
        fab fa-github
      </v-icon>
    </v-btn>
    <v-btn x-small value="twitter" href="https://twitter.com/gjovanov" target="_blank" class="ma-0">
      <span>Twitter</span>
      <v-icon small>
        fab fa-twitter
      </v-icon>
    </v-btn>
    <v-btn x-small value="linkedin" href="https://www.linkedin.com/in/gjovanov" target="_blank" class="ma-0">
      <span>Linked in</span>
      <v-icon small>
        fab fa-linkedin
      </v-icon>
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

<style scoped>
 .v-item-group.v-bottom-navigation .v-btn {
   min-width: 40px;
 }
</style>
