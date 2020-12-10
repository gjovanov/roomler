<template>
  <v-container
    class="pt-0 pr-0 pl-0 pb-8 mt-0 mr-0 ml-0 mb-8"
    fluid
  >
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <v-card>
          <v-card-title class="justify-center">
            <span class="text-h3" style="display: inline;">{{ $t('pages.home.title') }}</span>
          </v-card-title>
          <v-card-text>
            <h4 class="text-center">
              {{ $t('pages.home.tagline') }}
            </h4>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <v-card>
          <v-card-title>
            {{ $t('pages.home.glimpse') }}
          </v-card-title>
          <v-card-text
            class="justify-center"
          >
            <iframe
              :src="youtubeLink"
              width="100%"
              height="315"
              frameborder="0"
              allowfullscreen
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <v-btn :to="localePath({ name: 'explore-rooms' })" dark outlined block class="teal">
          <v-icon>fa-search</v-icon> &nbsp; {{ $t('pages.home.exploreRooms') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <h3 class="text-center">
          ... {{ $t('pages.home.or') }} ...
        </h3>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <v-btn :to="localePath({ name: '--room-create' })" dark outlined block class="secondary">
          <v-icon>fa-pluse</v-icon> &nbsp; {{ $t('pages.home.createNewRoom') }}
        </v-btn>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        sm="9"
      >
        <v-card>
          <v-card-title>{{ $t('pages.home.recommendedBrowser') }}</v-card-title>
          <v-card-text class="text-center justify-center" position="center">
            <v-img class="text-center" width="64" src="/chrome_small.png" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row
      align="start"
      justify="center"
    >
      <v-col
        cols="12"
        xs="9"
        lg="3"
      >
        <v-card>
          <v-card-title class="pr-0">
            <v-icon>fa fa-phone</v-icon> &nbsp; <span class="text-uppercase">{{ $t('pages.home.multiPartyCalls') }}</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-video</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.video') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-phone</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.audio') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>screen_share</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.screenShare') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-key</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.encryptedSecure') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-users</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.participantsLimit') }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        xs="9"
        lg="3"
      >
        <v-card>
          <v-card-title class="pr-0">
            <v-icon>fa fa-comments</v-icon> &nbsp; <span class="text-uppercase">{{ $t('pages.home.powerfulChat') }}</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-font</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.richText') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-file-alt</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.fileSharing') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-smile-wink</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.emojiGiphy') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-at</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.mentions') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-heart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.reactions') }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        xs="9"
        lg="3"
      >
        <v-card>
          <v-card-title class="pr-0">
            <v-icon>fa fa-users-cog</v-icon> &nbsp; <span class="text-uppercase">{{ $t('pages.home.administration') }}</span>
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-lock-open</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.publicRooms') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-lock</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.privateRooms') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>account_tree</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.roomHierarchy') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa-paper-plane</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.userInvites') }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-user-shield</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  {{ $t('pages.home.roleTypes') }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// import * as Janus from '~/lib/janus'

export default {
  components: {
  },

  data () {
    const config = this.$store.state.api.config.config
    return {
      youtubeLink: `https://www.youtube-nocookie.com/embed/lzHeRwVDfPQ?origin=${config.appSettings.env.URL}`
    }
  },

  beforeMount () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  * >>> .v-card__text, .v-card__title {
  word-break: normal; /* maybe !important  */
}
</style>
