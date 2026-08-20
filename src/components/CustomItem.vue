<script setup>
import { ref } from 'vue'
import { TAG_KEYS, taggedName } from '../utils/tags.js'
import { copyText } from '../utils/clipboard.js'

const props = defineProps({
  custom: { type: Object, required: true },
  index: { type: Number, required: true },
})

// Human-readable label for the invisible order tag (0-9, A-G), or a dash once
// we run out of tags.
const orderKey = TAG_KEYS[props.index] ?? '—'

const typeClass = {
  Fave: 'custom-type--fave',
  Yes: 'custom-type--yes',
  Maybe: 'custom-type--maybe',
  No: 'custom-type--no',
}

const copied = ref(false)
let copiedTimer

async function copyName() {
  const ok = await copyText(taggedName(props.custom.name, props.index))
  if (!ok) return
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1400)
}
</script>

<template>
  <li class="custom">
    <span class="custom__order" :title="`Order tag: ${orderKey}`">{{ orderKey }}</span>

    <div class="custom__body">
      <div class="custom__name">
        <span class="custom-type" :class="typeClass[custom.type]">{{ custom.type }}</span>
        <span>{{ custom.name }}</span>
      </div>
      <p v-if="custom.description" class="custom__desc">{{ custom.description }}</p>
    </div>

    <div class="custom__actions">
      <button
        type="button"
        class="btn btn--quiet"
        :class="{ 'btn--link': copied }"
        @click="copyName"
      >
        {{ copied ? 'Copied!' : 'Copy' }}
      </button>
    </div>
  </li>
</template>
