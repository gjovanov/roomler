<template>
  <div>
    <v-btn
      v-for="(oauth, index) in oauths"
      :key="oauth.name"
      :color="oauth.color"
      :style="`margin-left: ${index * 48}px !important;`"
      :href="oauth.url"
      fab
      absolute
      left
      bottom
      dark
      small
      elevation="0"
    >
      <v-icon>
        fab {{ oauth.icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      oauths: [
        {
          name: 'facebook',
          icon: 'fa-facebook',
          color: 'blue darken-3',
          url: '/oauth/login/facebook'
        },
        {
          name: 'google',
          icon: 'fa-google',
          color: 'red',
          url: '/oauth/login/google'
        },
        {
          name: 'github',
          icon: 'fa-github',
          color: 'grey darken-1',
          url: '/oauth/login/github'
        },
        {
          name: 'linkedin',
          icon: 'fa-linkedin',
          color: 'teal darken-4',
          url: '/oauth/login/linkedin'
        }
      ]
    }
  }
}
</script>
