<template>
  <v-container
    class="pa-0 ma-0"
    fluid
  >
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
          <v-card-text class="justify-center">
            <iframe
              src="https://www.youtube.com/embed/lzHeRwVDfPQ"
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
        sm="12"
        md="12"
        lg="3"
      >
        <v-card>
          <v-card-title>
            <v-icon>fa fa-phone</v-icon> &nbsp; MULTI PARTY CALLS
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-video</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Camera
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
                  <v-icon>fa fa-play</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Recording (coming soon...)
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
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        sm="12"
        md="12"
        lg="3"
      >
        <v-card>
          <v-card-title>
            <v-icon>fa fa-comments</v-icon> &nbsp; POWERFUL CHAT
          </v-card-title>
          <v-card-text>
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
        sm="12"
        md="12"
        lg="3"
      >
        <v-card>
          <v-card-title>
            <v-icon>fa fa-users</v-icon> &nbsp; ORGANIZED TEAMS
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-door-open</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Public Rooms
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-user-lock</v-icon>
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
                  <v-icon>fa fa-users</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  User roles (moderator, member)
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon>fa fa-lock</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  Secure communication
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

  beforeMount () {
  }
}
</script>
