<template>
  <div v-show="extension.options.query || extension.options.filteredItems.length" :id="extension.options.templateId" style="width: 320px">
    <template v-for="(emoji, index) in extension.options.filteredItems">
      <v-btn
        :key="emoji.id"
        tile
        :outlined="extension.options.navigatedIndex === index"
        @click="extension.selectItem(emoji)"
      >
        {{ emoji.char }}
      </v-btn>
    </template>
    <template v-if="!extension.options.filteredItems.length">
      <v-subheader>
        {{ $t('comps.chat.noEmojisFound') }}
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
