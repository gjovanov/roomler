<template>
  <client-only>
    <v-container>
      <v-row
        v-if="members.length === 1"
        dense
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-card
            color="white"
            hover
            light
          >
            <v-img
              class="accent--text align-end"

              src="/friends.png"
            >
              <v-card-title class="justify-center">
                It's more fun with friends
              </v-card-title>
            </v-img>
            <v-card-text>
              Let's invite some peers to join this room.
            </v-card-text>
            <v-card-actions
              align="center"
              justify="center"
            >
              <v-btn dark block outlined class="primary" :to="`/${room.path}/members?invite`">
                <v-icon>fa-users</v-icon> &nbsp; Invite peers
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
      <v-row
        v-if="members.length > 1"
        dense
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="12"
        >
          <v-timeline
            ref="messages-list"
            style="height: calc(100vh - 330px); overflow-y: auto"
            :reverse="reverse"
            dense
          >
            <v-timeline-item
              v-for="n in 10"
              :key="n"
            >
              <v-avatar slot="icon">
                <img src="http://i.pravatar.cc/64">
              </v-avatar>
              <span slot="opposite">Tus eu perfecto</span>
              <v-card class="elevation-2 mr-4 white darken-3" light>
                <v-card-title class="headline">
                  Lorem ipsum
                </v-card-title>
                <v-card-text>
                  Lorem ipsum dolor sit amet, no nam oblique veritus. Commune scaevola imperdiet nec ut, sed euismod convenire principes at. Est et nobis iisque percipit, an vim zril disputando voluptatibus, vix an salutandi sententiae.
                </v-card-text>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-col>
      </v-row>
      <v-row
        v-if="members.length > 1"
        dense
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="12"
        >
          <v-text-field
            id="new-message-txt"
            v-model="newMessage"
            label="Message"
            name="message"
            autocomplete="on"
            placeholder="Enter new message and press 'Enter'"
            outlined
            required
            class="pt-0 mt-0 pb-0 mb-0"
            @keydown.enter.prevent="sendMessage()"
          />
        </v-col>
      </v-row>
    </v-container>
  </client-only>
</template>

<script>

export default {
  middleware: 'authenticated',
  data () {
    return {
      reverse: false,
      newMessage: null
    }
  },
  computed: {
    room () {
      return this.$store.state.api.room.rooms.find(r => r.name.toLowerCase() === this.$route.params.roomname.toLowerCase())
    },
    members () {
      const users = this.room ? [this.room.owner, ...this.room.moderators, ...this.room.members] : []
      return users
    }
  },
  updated () {
    const messagesList = this.$refs['messages-list']
    messagesList.$el.scrollTop = messagesList.$el.scrollHeight
    this.$vuetify.goTo('#new-message-txt')
  },
  methods: {
    async sendMessage () {
      await this.$store.dispatch('api/message/create', {
        room: this.room._id,
        message: {
          type: 'text',
          content: this.newMessage
        }
      })
      this.newMessage = null
    }
  }
}
</script>
