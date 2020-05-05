<template>
  <v-dialog v-model="dialog" persistent max-width="600">
    <v-card>
      <v-card-text>
        <v-tabs v-model="tab">
          <v-tab
            v-for="t in tabs"
            :key="t.name"
          >
            <v-icon left>
              {{ t.icon }}
            </v-icon>
            {{ t.name }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card flat>
              <v-card-title class="headline">
                <v-form ref="search-form" v-model="search.valid" lazy-validation>
                  <v-text-field
                    v-model="search.query"
                    :rules="search.queryRules"
                    label="Search term"
                    name="search.query"
                    autocomplete="on"
                    required
                  />
                </v-form>
              </v-card-title>
              <v-card-text class="d-flex flex-row flex-wrap justify-center">
                <v-img
                  v-for="(item, index) in searchResult"
                  :key="`search-result-${index}`"
                  :src="item.images.original.url"
                  :lazy-src="item.images.original.url"
                  :width="150"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-text class="d-flex flex-row flex-wrap justify-center">
                <v-img
                  v-for="(item, index) in trendingResult"
                  :key="`trending-result-${index}`"
                  :src="item.images.original.url"
                  :lazy-src="item.images.original.url"
                  :width="150"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-title class="headline">
                <v-form ref="translate-form" v-model="translate.valid" lazy-validation>
                  <v-text-field
                    v-model="translate.query"
                    :rules="translate.queryRules"
                    label="Search term"
                    name="translate.query"
                    autocomplete="on"
                    required
                  />
                </v-form>
              </v-card-title>
              <v-card-text class="d-flex flex-row flex-wrap justify-center">
                <v-img
                  v-for="(item, index) in translateResult"
                  :key="`translate-result-${index}`"
                  :src="item.images.original.url"
                  :lazy-src="item.images.original.url"
                  :width="150"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
          <v-tab-item>
            <v-card flat>
              <v-card-title class="headline">
                <v-form ref="random-form">
                  <v-text-field
                    v-model="random.query"
                    label="Tag"
                    name="random.tag"
                    autocomplete="on"
                  />
                </v-form>
              </v-card-title>
              <v-card-text class="d-flex flex-row flex-wrap justify-center">
                <v-img
                  v-for="(item, index) in randomResult"
                  :key="`random-result-${index}`"
                  :src="item.images.original.url"
                  :lazy-src="item.images.original.url"
                  :width="150"
                />
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="grey" outlined @click="closeGiphyDialog()">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tab: 0,
      timeDuration: 200,
      search: {
        valid: false,
        query: '',
        queryRules: [
          v => !!v || 'Query is required'
        ],
        offset: 0,
        limit: 10,
        timeout: null
      },
      trending: {
        offset: 0,
        limit: 10
      },
      translate: {
        valid: false,
        query: '',
        queryRules: [
          v => !!v || 'Query is required'
        ],
        offset: 0,
        limit: 10,
        timeout: null
      },
      random: {
        tag: undefined,
        timeout: null
      },
      tabs: [
        {
          icon: 'fa-search',
          name: 'Search'
        },
        {
          icon: 'mdi-trending-up',
          name: 'Trending'
        },
        {
          icon: 'mdi-google-translate',
          name: 'Translate'
        },
        {
          icon: 'fa-random',
          name: 'Random'
        }
      ]
    }
  },
  computed: {
    searchResult () {
      return this.$store.state.api.giphy.searchResult
    },
    trendingResult () {
      return this.$store.state.api.giphy.trendingResult
    },
    translateResult () {
      return this.$store.state.api.giphy.translateResult
    },
    randomResult () {
      return this.$store.state.api.giphy.randomResult
    }
  },
  watch: {
    async tab (newVal) {
      if (this.tab === 1) {
        await this.$store.dispatch('api/giphy/trending', { })
      }
      if (this.tab === 3) {
        await this.$store.dispatch('api/giphy/random', { tag: this.random.tag })
      }
    },
    'search.query' (newVal) {
      const self = this
      this.$nextTick(() => {
        if (self.search.timeout) {
          clearTimeout(self.search.timeout)
        }
        self.search.timeout = setTimeout(async () => {
          await self.$store.dispatch('api/giphy/search', { query: newVal })
        }, self.timeDuration)
      })
    },
    'translate.query' (newVal) {
      const self = this
      this.$nextTick(() => {
        if (self.translate.timeout) {
          clearTimeout(self.translate.timeout)
        }
        self.translate.timeout = setTimeout(async () => {
          await self.$store.dispatch('api/giphy/translate', { query: newVal })
        }, self.timeDuration)
      })
    },
    'random.tag' (newVal) {
      const self = this
      this.$nextTick(() => {
        if (self.random.timeout) {
          clearTimeout(self.random.timeout)
        }
        self.random.timeout = setTimeout(async () => {
          await self.$store.dispatch('api/giphy/random', { query: newVal })
        }, self.timeDuration)
      })
    }
  },
  methods: {
    closeGiphyDialog () {
      this.$emit('closeGiphyDialog')
    },
    insertGif (gif) {
      this.$emit('insertGif', gif)
    }
  }
}
</script>
