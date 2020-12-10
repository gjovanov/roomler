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
          <v-expansion-panel-header>{{ $t('comps.invite.newInvite') }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-form ref="newInviteForm" v-model="isValidNewInvite" lazy-validation>
              <v-text-field
                v-model="newInvite.email"
                :rules="emailRules"
                :name="`email[${newInvite.id}]`"
                :label="$t('comps.invite.email')"
                autocomplete="on"
                required
                outlined
                dense
              />
              <v-spacer />
              <v-text-field
                v-model="newInvite.name"
                :name="`name[${newInvite.id}]`"
                :label="$t('comps.invite.name')"
                autocomplete="on"
                outlined
                dense
              />
              <v-spacer />
              <v-select
                v-model="newInvite.type"
                :items="types"
                item-value="id"
                item-text="name"
                :no-data-text="$t('comps.invite.type')"
                :label="$t('comps.invite.type')"
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
                <v-icon>fa-plus</v-icon> {{ $t('comps.invite.addInvite') }}
              </v-btn>
            </v-form>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header>{{ $t('comps.invite.inviteList') }}</v-expansion-panel-header>
          <v-expansion-panel-content>
            <em v-if="!invites.length">
              {{ $t('comps.invite.emptyList') }}
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
                    :label="$t('comps.invite.email')"
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
                    :label="$t('comps.invite.name')"
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
                    :label="$t('comps.invite.type')"
                    :no-data-text="$t('comps.invite.type')"
                    item-value="id"
                    item-text="name"
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
          {{ $t('comps.invite.cancel') }}
        </v-btn>
        <v-spacer />
        <v-btn
          :disabled="!areValidInvites || !invites.length"
          color="primary"
          outlined
          class="ma-3"
          @click="sendInvites()"
        >
          {{ $t('comps.invite.sendInvites') }}
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
    const self = this
    const config = this.$store.state.api.config.config
    const defaultInvite = {
      name: '',
      email: '',
      type: config.dataSettings.invite.defaults.type
    }
    const defaultTypes = config.dataSettings.invite.types
    const types = defaultTypes.map((t) => {
      return {
        id: t,
        name: self.$t(`comps.invite.${t}`)
      }
    })
    const newInvite = Object.assign({ id: uuid() }, defaultInvite)

    return {
      isValidNewInvite: true,
      areValidInvites: true,

      emailRules: [
        v => !!v || self.$t('comps.invite.emailRequired'),
        v => /\S+@\S+\.\S+/.test(v) || self.$t('comps.invite.emailValid')
      ],

      panel: [0, 1],
      defaultInvite,
      newInvite,
      defaultTypes,
      types,
      invites: []
    }
  },
  watch: {
    dialog (newVal) {
      const self = this
      if (newVal) {
        this.types = this.defaultTypes.map((t) => {
          return {
            id: t,
            name: self.$t(`comps.invite.${t}`)
          }
        })
      }
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
