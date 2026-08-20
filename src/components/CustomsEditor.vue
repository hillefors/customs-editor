<script setup>
import { reactive, ref } from 'vue'
import { MAX_TAGS } from '../utils/tags.js'
import CustomItem from './CustomItem.vue'

const TYPES = ['Fave', 'Yes', 'Maybe', 'No']

const customs = reactive([])

const draft = reactive({
  name: '',
  description: '',
  type: 'Fave',
})

const nameInput = ref(null)
let nextId = 1

function addCustom() {
  const name = draft.name.trim()
  if (!name) return

  customs.push({
    id: nextId++,
    name,
    description: draft.description.trim(),
    type: draft.type,
  })

  // Reset for the next entry, keeping the chosen type as a sensible default.
  draft.name = ''
  draft.description = ''
  nameInput.value?.focus()
}
</script>

<template>
  <section class="card card--elevated">
    <form class="custom-form" @submit.prevent="addCustom">
      <div class="field custom-form__name">
        <label class="label" for="custom-name">Name</label>
        <input
          id="custom-name"
          ref="nameInput"
          v-model="draft.name"
          class="input"
          type="text"
          placeholder="e.g. Slow burn romance"
          autocomplete="off"
        />
      </div>

      <div class="field custom-form__type">
        <label class="label" for="custom-type">Type</label>
        <div class="select">
          <select id="custom-type" v-model="draft.type">
            <option v-for="t in TYPES" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div class="field custom-form__desc">
        <label class="label" for="custom-desc">Description</label>
        <input
          id="custom-desc"
          v-model="draft.description"
          class="input"
          type="text"
          placeholder="Optional — a short note about this custom"
          autocomplete="off"
        />
      </div>

      <div class="custom-form__submit">
        <button type="submit" class="btn btn--primary" :disabled="!draft.name.trim()">
          Add custom
        </button>
      </div>
    </form>
  </section>

  <ol v-if="customs.length" class="customs mt-3">
    <CustomItem
      v-for="(custom, i) in customs"
      :key="custom.id"
      :custom="custom"
      :index="i"
    />
  </ol>
  <p v-else class="customs__empty mt-3">
    No customs yet, add your first one above.
  </p>

  <p v-if="customs.length > MAX_TAGS" class="color-warning mt-2 font-size-sm">
    Heads up: only the first {{ MAX_TAGS }} customs get an ordering tag. Extras
    keep their natural order.
  </p>
</template>
