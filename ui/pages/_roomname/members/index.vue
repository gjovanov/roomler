<template>
  <client-only>
    <v-layout>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="12"
        >
          <v-list three-line>
            <v-subheader
              v-text="'Members'"
            />

            <v-divider />
            <template v-for="(item, index) in members">
              <v-divider
                :key="index"
                :inset="true"
              />

              <v-list-item
                :key="item._id"
              >
                <v-list-item-avatar>
                  <v-img :src="item.avatar_url" />
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title v-text="item.username" />
                  <v-list-item-subtitle v-text="item.email" />
                  <v-list-item-action-text v-text="item.role" />
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn-toggle
                    v-model="item.role"
                    rounded
                    color="primary accent-3"
                  >
                    <v-btn>
                      Owner
                    </v-btn>

                    <v-btn>
                      Member
                    </v-btn>

                    <v-btn>
                      Moderator
                    </v-btn>
                  </v-btn-toggle>
                </v-list-item-action>
              </v-list-item>
            </template>
            <v-subheader
              v-text="'Invites'"
            />
            <v-divider />
          </v-list>
          <v-btn
            color="primary"
            right
            :to="`/${room.path}/members/invite`"
          >
            Invite
          </v-btn>
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
      text: ''
    }
  },
  computed: {
    room () {
      return this.$store.state.api.room.rooms.find(r => r.name.toLowerCase() === this.$route.params.roomname.toLowerCase())
    },
    members () {
      const users = [this.room.owner, ...this.room.moderators, ...this.room.members]
      return users
    }
  }
}
</script>
