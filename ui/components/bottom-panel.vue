<template>
  <v-bottom-navigation
    v-model="bottomNav"
    absolute
    height="42"
  >
    <v-btn x-small value="terms" to="/tos/terms" class="ma-0">
      <span>Terms</span>
      <v-icon small>
        fa fa-list-alt
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
    <v-btn x-small value="twitter" href="https://www.facebook.com/Roomler-101573398250025" target="_blank" class="ma-0">
      <span>Facebook</span>
      <v-icon small>
        fab fa-facebook
      </v-icon>
    </v-btn>
    <v-btn x-small value="linkedin" href="https://www.linkedin.com/company/roomler" target="_blank" class="ma-0">
      <span>LinkedIn</span>
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
