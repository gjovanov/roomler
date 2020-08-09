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
            <span class="text-h3" style="display: inline;">Multi-party Video Conferencing</span>
          </v-card-title>
          <v-card-text>
            <h4 class="text-center">
              Powerful & Effective Remote Team Collaboration
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
            Get a Glimpse of Roomler
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
        <v-btn :to="`/explore/rooms`" dark outlined block class="teal">
          <v-icon>fa-search</v-icon> &nbsp; Explore rooms
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
          ... or ...
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
        <v-btn :to="`/@/room/create`" dark outlined block class="secondary">
          <v-icon>fa-pluse</v-icon> &nbsp; Create new room
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
          <v-card-title>For best User Experience use Google Chrome (Recommended Browser):</v-card-title>
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
            <v-icon>fa fa-phone</v-icon> &nbsp; MULTI PARTY CALLS
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-video</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Video
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-phone</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Audio
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>screen_share</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Screen share
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-key</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Encrypted & secure
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-users</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Up to 50 participants
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
            <v-icon>fa fa-comments</v-icon> &nbsp; POWERFUL CHAT
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-font</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Rich-text
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-file-alt</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  File sharing
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-smile-wink</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Emojis & Giphy's
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-at</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Mentions
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-heart</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Reactions
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
            <v-icon>fa fa-users</v-icon> &nbsp; ORGANIZED ROOMS
          </v-card-title>
          <v-card-text class="pa-0">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-lock-open</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Public Rooms
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-lock</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Private Rooms
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>account_tree</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Hierarchy of Rooms
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-user-shield</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Moderator & member roles
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>mdi-message-lock</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Secure conversations
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
