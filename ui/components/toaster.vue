<template>
  <v-row
    justify="center"
    align="center"
  >
    <v-snackbar
      v-for="(toast, index) in toasts"
      :key="toast.id"
      v-model="toast.snackbar"
      :timeout="3000"
      :absolute="true"
      :top="true"
      :color="toast.error ? 'error' : 'success'"
    >
      <strong v-if="toast.prop !== 'global'"> {{ toast.prop }} </strong> &nbsp; <span>{{ toast.message }}</span>
      <v-btn
        dark
        text
        @click="remove(index)"
      >
        {{ $t('comps.toast.close') }}
      </v-btn>
    </v-snackbar>
  </v-row>
</template>

<script>
export default {
  computed: {
    toasts () {
      return this.$store.state.toast.toasts.map(t => Object.assign({}, t))
    }
  },
  methods: {
    remove (index) {
      this.$store.commit('toast/pull', index, {
        root: true
      })
    }
  }
}
</script>
