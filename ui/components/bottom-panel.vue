<template>
  <v-bottom-navigation
    v-model="bottomNav"
    padless
    absolute
    shift
    style="background-color: #363636;"
  >
    <v-btn value="privacy" to="/tos/privacy">
      Privacy terms
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
