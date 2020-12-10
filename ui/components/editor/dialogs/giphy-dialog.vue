<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card>
      <v-card-text>
        <v-tabs v-model="tab" centered>
          <v-tab
            v-for="t in tabs"
            :key="t.id"
          >
            {{ $t(`comps.chat.${t.name}`) }}
          </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item
            v-for="t in tabs"
            :key="`tab-item-${t.id}`"
          >
            <v-card flat light>
              <v-card-title class="pt-0 mt-0">
                <v-text-field
                  v-model="query"
                  :label="$t('comps.chat.searchTerm')"
                  :name="`query-${t.id}`"
                  autocomplete="on"
                  class="pt-0 mt-0"
                  full-width
                  required
                  clearable
                />
              </v-card-title>
              <v-card-text class="d-flex flex-row flex-wrap justify-center">
                <template
                  v-for="(item, index) in searchData"
                >
                  <v-hover
                    :key="`search-result-${t.name}-${index}`"
                    v-slot="{ hover }"
                    class="ma-1"
                  >
                    <v-card
                      :elevation="hover ? 12 : 2"
                      :class="{ 'on-hover': hover }"
                      @click="insertGif(item)"
                    >
                      <v-img
                        :src="getUrl(item.images)"
                        aspect-ratio="1.4"
                        :width="100"
                      />
                    </v-card>
                  </v-hover>
                </template>
              </v-card-text>
              <v-card-actions>
                <v-pagination
                  v-model="page"
                  :length="pagesCount"
                  :total-visible="5"
                />
              </v-card-actions>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-card-text>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="closeGiphyDialog()"
        >
          {{ $t('comps.chat.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          text
          class="ma-3"
          href="https://support.giphy.com/hc/en-us/articles/360032872931-GIPHY-Privacy-Policy"
        >
          <v-img src="/giphy/PoweredBy_200_Horizontal_Light-Backgrounds_With_Logo.gif" />
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
      endpoint: 'gifs',
      query: 'LOL',
      page: 1,
      offset: 0,
      limit: 18,
      timeout: null,
      tabs: [
        {
          id: 'giphs-tab',
          icon: 'mdi-gif',
          name: 'giphs'
        },
        {
          id: 'stikers-tab',
          icon: 'mdi-sticker-emoji',
          name: 'stickers'
        }
      ]
    }
  },
  computed: {
    searchData () {
      return this.$store.state.api.giphy.search.data
    },
    searchPagination () {
      return this.$store.state.api.giphy.search.pagination
    },
    pagesCount () {
      const totalCount = this.searchPagination.total_count < 5000 ? this.searchPagination.total_count : 4999
      const count = parseInt(totalCount / this.limit)
      return count
    }
  },
  watch: {
    dialog (newVal) {
      if (newVal === true) {
        this.search(this.query)
        // this.page = 1
        // this.query = 'LOL'
        // this.tag = 0
        // this.endpoint = 'gifs'
      }
    },
    tab (newVal) {
      this.endpoint = newVal === 1 ? 'stickers' : 'gifs'
      this.page = 1
      this.search(this.query)
    },
    'page' (newVal) {
      this.offset = this.limit * (newVal - 1)
    },
    'query' (newVal) {
      this.offset = 0
      this.search(newVal)
    },
    'offset' (newVal) {
      this.search(this.query)
    }
  },
  methods: {
    search (query) {
      const self = this
      this.$nextTick(() => {
        if (self.search.timeout) {
          clearTimeout(self.search.timeout)
        }
        self.search.timeout = setTimeout(async () => {
          await self.$store.dispatch('api/giphy/search',
            {
              endpoint: self.endpoint,
              query,
              offset: self.offset,
              limit: self.limit
            })
        }, self.timeDuration)
      })
    },
    getUrl (image) {
      if (image.fixed_height_small) {
        return image.fixed_height_small.url
      }
      if (image.fixed_height) {
        return image.fixed_height.url
      }
      return image.original.url
    },
    closeGiphyDialog () {
      this.$emit('closeGiphyDialog')
    },
    insertGif (gif) {
      this.$emit('insertGif', gif)
    }
  }
}
</script>
