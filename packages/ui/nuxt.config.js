const colors = require('vuetify/es5/util/colors').default
const config = require('roomler.config')
const env = config.appSettings.env
// you ask why simply not negated produciton and get development? Well there is test and many other potential env types :)
const isProd = env.NODE_ENV === 'production'
const isDev = env.NODE_ENV === 'development'

const nuxtConfig = {
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
  components: true,
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
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    'portal-vue/nuxt'
  ],
  buildModules: [
    '@nuxtjs/google-analytics',
    '@nuxtjs/moment',
    '@nuxtjs/pwa',
    '@nuxtjs/vuetify',
    'nuxt-i18n'
  ],
  axios: {
    // credentials: true
  },
  googleAnalytics: {
    id: process.env.GOOGLE_ANALYTICS_ID,
    debug: {
      enabled: !isProd,
      sendHitTask: isProd
    }
  },
  icon: {
    sizes: [64, 120, 144, 152, 192, 384, 512],
    purpose: ['any', 'maskable']
  },
  workbox: {
    offlineAnalytics: true,
    dev: isDev,
    globPatterns: ['**/*.{js,css,png}', '**/uploads/*', '**/audio/*'],
    config: {
      debug: isDev
    },
    importScripts: [
      'custom-sw.js'
    ],
    preCaching: [
      'precache.js'
    ]
  },
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    treeShake: true,
    theme: {
      options: {
        customProperties: true
      },
      dark: false,
      themes: {
        light: {
          background: colors.grey.lighten3,
          primary: colors.teal.base,
          accent: colors.grey.darken3,
          secondary: colors.red.lighten1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        },
        dark: {
          background: '#555555',
          primary: colors.teal.lighten4,
          accent: colors.grey.darken3,
          secondary: colors.red.lighten1,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  i18n: {
    langDir: 'lang/',
    fallbackLocale: 'en',
    lazy: true,
    strategy: 'no_prefix',
    locales: [
      { code: 'bg', iso: 'bg-BG', name: 'Български', file: 'bg.js' },
      { code: 'de', iso: 'de-DE', name: 'Deutsch', file: 'de.js' },
      { code: 'en', iso: 'en-US', name: 'English', file: 'en.js' },
      { code: 'pt', iso: 'pt-BR', name: 'Português', file: 'pt.js' }
    ]
  },
  build: {
    extractCSS: { ignoreOrder: true },
    extend (config, ctx) {
      config.resolve.alias.vue = 'vue/dist/vue.common'
      config.devtool = isDev ? '#source-map' : ''
    }
  }
}

nuxtConfig.axios.baseURL = env.API_URL
if (env.NODE_ENV === 'development') {
  nuxtConfig.modules.push('@nuxtjs/eslint-module')
}

module.exports = nuxtConfig
