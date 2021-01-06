<template>
  <v-menu
    v-model="menu"
    open-on-hover
    bottom
    offset-x
  >
    <template #activator="{ on }">
      <v-btn
        :disabled="invite.status !== 'pending'"
        fab
        x-small
        :dark="!isDark"
        :light="isDark"
        elevation="0"
        v-on="on"
      >
        <v-icon x-small>
          fa-edit
        </v-icon>
      </v-btn>
    </template>
    <v-list v-if="invite.status === 'pending'">
      <v-list-item
        v-if="invite.type !== 'member'"
        @click="toMember()"
      >
        <v-list-item-title>
          {{ $t('comps.invite.demoteToMember') }}
        </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="invite.type !== 'moderator'"
        @click="toModerator()"
      >
        <v-list-item-title>
          {{ $t('comps.invite.promoteToModerator') }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>

export default {
  props: {
    room: {
      type: Object,
      default: null
    },
    invite: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      menu: false
    }
  },
  computed: {
    isDark () {
      return this.$vuetify.theme.dark
    }
  },
  methods: {
    toMember () {
      this.$emit('toMember', this.invite)
    },
    toModerator () {
      this.$emit('toModerator', this.invite)
    }
  }
}
</script>
