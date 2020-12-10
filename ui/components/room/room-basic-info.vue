<template>
  <div v-if="room">
    <v-text-field
      v-model="room.name"
      :label="$t('comps.room.roomName')"
      name="name"
      autocomplete="on"
      disabled
      required
    >
      <template #append>
        <v-tooltip
          bottom
        >
          <template #activator="{ on }">
            <v-icon
              v-on="on"
            >
              {{ `${room.is_open ? 'fa-lock-open' : 'fa-lock'}` }}
            </v-icon>
          </template>
          {{ `${room.is_open ? $t('comps.room.openRoom') : $t('comps.room.closedRoom') }` }}
        </v-tooltip>
      </template>
    </v-text-field>
    <v-spacer />
    <v-combobox
      v-model="room.tags"
      :items="room.tags"
      :label="$t('comps.room.tags')"
      multiple
      chips
      disabled
    >
      <template #selection="data">
        <v-chip
          :key="JSON.stringify(data.item)"
          v-bind="data.attrs"
          :input-value="data.selected"
          :disabled="data.disabled"
          @click:close="data.parent.selectItem(data.item)"
        >
          {{ data.item }}
        </v-chip>
      </template>
    </v-combobox>
    <v-spacer />
    <v-textarea
      v-model="room.description"
      :label="$t('comps.room.description')"
      name="description"
      autocomplete="on"
      disabled
    />
  </div>
</template>

<script>
export default {
  props: {
    room: {
      type: Object,
      default: null
    }
  }
}
</script>
