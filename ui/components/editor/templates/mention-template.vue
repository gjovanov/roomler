<template>
  <div v-show="extension.options.query || extension.options.filteredItems.length" :id="extension.options.templateId">
    <v-list rounded>
      <v-list-item-group
        v-model="extension.options.navigatedIndex"
        color="primary"
      >
        <template
          v-for="(user, index) in extension.options.filteredItems"
        >
          <v-list-item
            :key="index"
            @click="extension.selectItem(user)"
          >
            <v-list-item-avatar>
              <v-img v-if="user.avatarUrl" :src="user.avatarUrl" />
              <v-icon v-if="!user.avatarUrl">
                fa-user
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content class="pl-2">
              <v-list-item-title v-text="user.name" />
              <v-list-item-action-text />
            </v-list-item-content>
          </v-list-item>
          <v-divider :key="`divider_${index}`" />
        </template>
      </v-list-item-group>
    </v-list>
    <template v-if="!extension.options.filteredItems.length">
      <v-subheader>
        No users found
      </v-subheader>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    extension: {
      type: Object,
      default: null
    }
  }
}
</script>
