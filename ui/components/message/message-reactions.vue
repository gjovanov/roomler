<template>
  <v-speed-dial
    v-model="fab"
    bottom
    right
    absolute
    direction="left"
    open-on-hover
    transition="slide-y-reverse-transition"
    style="bottom: -20px; right: 80px"
  >
    <template v-slot:activator>
      <v-badge
        top
        right
        overlap
        class="align-self-center"
      >
        <template v-slot:badge>
          <span>+</span>
        </template>
        <v-btn
          v-model="fab"
          dark
          fab
          small
        >
          <v-icon v-if="fab" light>
            mdi-close
          </v-icon>
          <v-icon v-else light>
            fa-smile
          </v-icon>
        </v-btn>
      </v-badge>
    </template>
    <v-btn
      fab
      dark
      small
      color="green"
    >
      <v-icon>mdi-pencil</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="indigo"
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-btn
      fab
      dark
      small
      color="red"
    >
      <v-icon>mdi-delete</v-icon>
    </v-btn>
  </v-speed-dial>
</template>
<script>
export default {
  data () {
    return {
      fab: false
    }
  }
}
</script>
