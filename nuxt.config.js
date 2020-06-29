const colors = require('vuetify/es5/util/colors').default
const config = require('./config')
const env = config.appSettings.env

const nuxtConfig = {
  srcDir: 'ui',
  mode: 'universal',

  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [{
      charset: 'utf-8'
    }, {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    }, {
      hid: 'description',
      name: 'description',
      content: process.env.npm_package_description || ''
    }],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
    }
    ]
  },
  loading: {
    color: '#fff'
  },
  css: [],
  env,
  router: {
    // middleware: 'check-auth'
  },
  plugins: [
    '@/plugins/axios',
    '@/plugins/consola.client',
    '@/plugins/consola.server',
    '@/plugins/axios',
    '@/plugins/icons',
    '@/plugins/janus.client',
    '@/plugins/ws.client'
  ],
  modules: [
    '@nuxtjs/vuetify',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'portal-vue/nuxt'
  ],
  buildModules: [
    '@nuxtjs/moment'
  ],
  axios: {
    // credentials: true
  },
  vuetify: {
    treeShake: true,
    theme: {
      light: {
        background: '#cccccc',
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      },
      dark: {
        background: '#555555',
        primary: colors.blue.darken2,
        accent: colors.grey.darken3,
        secondary: colors.amber.darken3,
        info: colors.teal.lighten1,
        warning: colors.amber.base,
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  },
  build: {
    extend (config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
      config.devtool = '#source-map' // ctx.isClient ? '#source-map' : '#inline-source-map'
    }
  }
}
nuxtConfig.axios.baseURL = env.API_URL
if (env.NODE_ENV === 'development') {
  nuxtConfig.modules.push('@nuxtjs/eslint-module')
}

module.exports = nuxtConfig
