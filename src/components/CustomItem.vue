<script setup>
import { computed, ref } from 'vue'
import { tagWidth, tagKey, taggedName, taggedLength, NAME_LIMIT } from '../utils/tags.js'
import { copyText } from '../utils/clipboard.js'

const props = defineProps({
  custom: { type: Object, required: true },
  index: { type: Number, required: true },
  count: { type: Number, required: true },
})

const emit = defineEmits(['remove'])

// Human-readable label for the invisible tag, padded to the box's width.
const orderKey = computed(() => tagKey(props.index, tagWidth(props.count)))

// A name added while the box was smaller can overflow once the tag widens.
const overflow = computed(
  () => taggedLength(props.custom.name, props.count) - NAME_LIMIT
)

</script>

<template>
  <li class="custom" :class="{ 'custom--overflow': overflow > 0 }">
    <button
      type="button"
      class="custom__handle"
      aria-label="Drag to reorder"
      title="Drag to reorder"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="5" cy="3" r="1.4" /><circle cx="11" cy="3" r="1.4" />
        <circle cx="5" cy="8" r="1.4" /><circle cx="11" cy="8" r="1.4" />
        <circle cx="5" cy="13" r="1.4" /><circle cx="11" cy="13" r="1.4" />
      </svg>
    </button>

    <span class="custom__order" :title="`Order tag: ${orderKey}`">{{ orderKey }}</span>

    <div class="custom__body">
      <div class="custom__name">{{ custom.name }}</div>
      <p v-if="custom.description" class="custom__desc">{{ custom.description }}</p>
      <p v-if="overflow > 0" class="custom__warning">
        Too long by {{ overflow }} — trim the name so it fits the site's {{ NAME_LIMIT }}-char limit with its tag.
      </p>
    </div>

    <div class="custom__actions">
      <button
        type="button"
        class="btn btn--quiet custom__remove"
        aria-label="Remove custom"
        title="Remove"
        @click="emit('remove')"
      >
        ×
      </button>
    </div>
  </li>
</template>
