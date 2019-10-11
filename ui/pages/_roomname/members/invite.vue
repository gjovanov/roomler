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
          <v-card class="elevation-0">
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row
                  v-for="invite in invites"
                  :key="invite.id"
                  align="center"
                  justify="center"
                >
                  <v-text-field
                    v-model="invite.email"
                    :rules="emailRules"
                    label="Email"
                    :name="`email[${invite.id}]`"
                    autocomplete="on"
                    required
                    outlined
                  />
                  <v-text-field
                    v-model="invite.name"
                    label="Name"
                    :name="`name[${invite.id}]`"
                    autocomplete="on"
                    outlined
                  />
                  <v-select
                    v-model="invite.type"
                    :items="types"
                    label="Type"
                    no-data-text="Type"
                    outlined
                  />
                  <v-btn @click="pop(invite)">
                    <v-icon>fa-minus</v-icon>
                  </v-btn>
                </v-row>
              </v-form>
              <v-divider />
              <v-form ref="newRecordForm" v-model="isNewRecordValid" lazy-validation>
                <v-row>
                  <v-text-field
                    v-model="newInvite.email"
                    :rules="emailRules"
                    label="Email"
                    :name="`email[${newInvite.id}]`"
                    autocomplete="on"
                    required
                    outlined
                  />
                  <v-text-field
                    v-model="newInvite.name"
                    label="Name"
                    :name="`name[${newInvite.id}]`"
                    autocomplete="on"
                    outlined
                  />
                  <v-select
                    v-model="newInvite.type"
                    :items="types"
                    no-data-text="Type"
                    label="Type"
                    outlined
                  />
                  <v-btn @click="push">
                    <v-icon>fa-plus</v-icon>
                  </v-btn>
                </v-row>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn
                :disabled="!valid"
                color="primary"
                right
                @click="createInvites()"
              >
                Invite
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </client-only>
</template>

<script>
import * as uuid from 'uuid/v4'
import {
  handleSuccess
} from '@/services/ajax-handlers'

const config = require('@@/config')
const inviteSettings = config.dataSettings.invite

const defaultInvite = {
  name: '',
  email: '',
  type: inviteSettings.defaults.type
}

export default {
  middleware: 'authenticated',
  data () {
    return {
      valid: true,
      isNewRecordValid: true,

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid'
      ],

      invites: [

      ],
      newInvite: Object.assign({ id: uuid() }, defaultInvite),

      types: inviteSettings.types
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
  },
  methods: {
    push () {
      if (this.$refs.newRecordForm.validate()) {
        this.newInvite.room = this.room._id
        this.invites.push(this.newInvite)
        this.newInvite = Object.assign({ id: uuid() }, defaultInvite)
      }
    },
    pop (invite) {
      this.invites = this.invites.filter(i => i.id !== invite.id)
    },
    async createInvites () {
      if (this.$refs.form.validate()) {
        const response = await this.$store.dispatch('api/invite/create', this.invites)
        if (!response.hasError) {
          handleSuccess('Your peers have been invited successfully.', this.$store.commit)
          this.$router.push({ path: `/${this.room.path}/members` })
        }
      }
    }
  }
}
</script>
