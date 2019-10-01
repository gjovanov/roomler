<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          lg="8"
          md="12"
        >
          <h1>{{ room.name }}</h1>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    return {
    }
  },
  computed: {
    room () {
      return this.$store.state.room.rooms.find(r => r.name.toLowerCase() === this.$route.params.roomname.toLowerCase())
    }
  },
  methods: {
  }
}
</script>
