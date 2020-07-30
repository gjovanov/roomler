<template>
  <v-dialog v-model="dialog" persistent retain-focus max-width="800px">
    <v-card>
      <v-expansion-panels
        v-model="panel"
        accordion
        multiple
        tile
        flat
      >
        <v-expansion-panel>
          <v-expansion-panel-header>New invite</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="newInviteForm" v-model="isValidNewInvite" lazy-validation>
              <v-text-field
                v-model="newInvite.email"
                :rules="emailRules"
                :name="`email[${newInvite.id}]`"
                label="Email"
                autocomplete="on"
                required
                outlined
                dense
              />
              <v-spacer />
              <v-text-field
                v-model="newInvite.name"
                :name="`name[${newInvite.id}]`"
                label="Name"
                autocomplete="on"
                outlined
                dense
              />
              <v-spacer />
              <v-select
                v-model="newInvite.type"
                :items="types"
                no-data-text="Type"
                label="Type"
                outlined
                dense
              />
              <v-btn
                :disabled="!isValidNewInvite"
                color="primary"
                outlined
                class="justify-end"
                @click="push"
              >
                <v-icon>fa-plus</v-icon> Add invite
              </v-btn>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>Invite list</v-expansion-panel-header>
          <v-expansion-panel-content>
            <em v-if="!invites.length">
              Please add some invites in this list.
            </em>
            <v-form ref="invitesForm" v-model="areValidInvites" lazy-validation>
              <v-row
                v-for="invite in invites"
                :key="invite.id"
                justify="center"
                class="pt-0 pb-0"
              >
                <v-col
                  cols="12"
                  md="4"
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="invite.email"
                    :rules="emailRules"
                    :name="`email[${invite.id}]`"
                    label="Email"
                    autocomplete="on"
                    dense
                    required
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="3"
                  class="pt-0 pb-0"
                >
                  <v-text-field
                    v-model="invite.name"
                    :name="`name[${invite.id}]`"
                    label="Name"
                    autocomplete="on"
                    dense
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="4"
                  class="pt-0 pb-0"
                >
                  <v-select
                    v-model="invite.type"
                    :items="types"
                    label="Type"
                    no-data-text="Type"
                    dense
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="1"
                  class="pt-0 pb-0"
                >
                  <v-btn
                    color="red"
                    fab
                    x-small
                    @click="pop(invite)"
                  >
                    <v-icon>fa-trash-alt</v-icon>
                  </v-btn>
                </v-col>
                <v-divider />
              </v-row>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
      <v-card-actions>
        <v-btn
          color="grey"
          outlined
          class="ma-3"
          @click="cancelInvites()"
        >
          Cancel
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!areValidInvites || !invites.length"
          color="primary"
          outlined
          class="ma-3"
          @click="sendInvites()"
        >
          Send invites
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { v4 as uuid } from 'uuid'

export default {
  props: {
    dialog: {
      type: Boolean,
      default: false
    },
    room: {
      type: Object,
      default: null
    }
  },
  data () {
    const config = this.$store.state.api.config.config
    const defaultInvite = {
      name: '',
      email: '',
      type: config.dataSettings.invite.defaults.type
    }
    const types = config.dataSettings.invite.types
    const newInvite = Object.assign({ id: uuid() }, defaultInvite)

    return {
      isValidNewInvite: true,
      areValidInvites: true,

      emailRules: [
        v => !!v || 'E-mail is required',
        v => /\S+@\S+\.\S+/.test(v) || 'E-mail must be valid'
      ],

      panel: [0, 1],
      defaultInvite,
      newInvite,
      types,
      invites: []
    }
  },
  methods: {
    cancelInvites () {
      this.$emit('cancelInvites')
      this.invites = []
    },
    push () {
      if (this.$refs.newInviteForm.validate()) {
        this.newInvite.room = this.room._id
        this.invites.push(this.newInvite)
        this.newInvite = Object.assign({ id: uuid() }, this.defaultInvite)
      }
    },
    pop (invite) {
      this.invites = this.invites.filter(i => i.id !== invite.id)
    },
    sendInvites () {
      if (this.$refs.invitesForm.validate()) {
        this.$emit('sendInvites', this.invites)
        this.invites = []
      }
    }
  }
}
</script>
