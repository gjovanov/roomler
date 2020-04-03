<template>
  <div>
    <v-text-field
      v-model="room.name"
      label="Room name"
      name="name"
      autocomplete="on"
      disabled
      required
    >
      <template v-slot:append>
        <v-tooltip
          bottom
        >
          <template v-slot:activator="{ on }">
            <v-icon
              v-on="on"
            >
              {{ `${room.is_open ? 'fa-lock-open' : 'fa-lock'}` }}
            </v-icon>
          </template>
          {{ `${room.is_open ? 'Open room (join allowed to everyone)' : 'Closed room (invite-only join)'}` }}
        </v-tooltip>
      </template>
    </v-text-field>
    <v-spacer />
    <v-combobox
      v-model="room.tags"
      :items="room.tags"
      label="Tags"
      multiple
      chips
      disabled
    >
      <template v-slot:selection="data">
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
      label="Description"
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
