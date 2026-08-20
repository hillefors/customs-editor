<script setup>
import draggable from 'vuedraggable'
import CustomItem from './CustomItem.vue'

const props = defineProps({
  type: { type: String, required: true }, // Fave | Yes | Maybe | No
  items: { type: Array, required: true },
})

const emit = defineEmits(['remove'])

const modifier = {
  Fave: 'custom-box--fave',
  Yes: 'custom-box--yes',
  Maybe: 'custom-box--maybe',
  No: 'custom-box--no',
}
</script>

<template>
  <section class="custom-box" :class="modifier[type]">
    <header class="custom-box__header">
      <h2 class="custom-box__title">{{ type }}</h2>
      <span class="custom-box__count">{{ items.length }}</span>
    </header>

    <draggable
      :list="items"
      item-key="id"
      tag="ol"
      class="customs"
      handle=".custom__handle"
      :animation="150"
      ghost-class="custom--ghost"
      drag-class="custom--drag"
    >
      <template #item="{ element, index }">
        <CustomItem
          :custom="element"
          :index="index"
          :count="items.length"
          @remove="emit('remove', element)"
        />
      </template>

      <template #footer>
        <li v-if="!items.length" class="customs__empty">
          Nothing here yet.
        </li>
      </template>
    </draggable>
  </section>
</template>
