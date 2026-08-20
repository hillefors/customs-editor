<script setup>
import { computed } from 'vue'
import { tagWidth, tagKey, taggedLength, NAME_LIMIT } from '../utils/tags.js'
import target from '../assets/target.png'

const props = defineProps({
  custom: { type: Object, required: true },
  index: { type: Number, required: true },
  count: { type: Number, required: true },
})

const emit = defineEmits(['remove', 'edit'])

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

    <img class="custom__image" :src="target" />

    <!-- <span class="custom__order" :title="`Order tag: ${orderKey}`">{{ orderKey }}</span> -->

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
        class="btn btn--quiet custom__edit"
        aria-label="Edit custom"
        title="Edit"
        @click="emit('edit', custom)"
      >
        <svg width="15" height="15" viewBox="0 0 16 16" aria-hidden="true">
          <path
            d="M11.5 1.5a1.4 1.4 0 0 1 2 2L5 12l-3 1 1-3 8.5-8.5Z"
            fill="none" stroke="currentColor" stroke-width="1.4"
            stroke-linejoin="round"
          />
        </svg>
      </button>
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
