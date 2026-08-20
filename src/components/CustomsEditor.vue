<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { maxNameLength } from '../utils/tags.js'
import {
  encodeState,
  decodeState,
  isEmpty,
  readStateParam,
  buildShareUrl,
} from '../utils/share.js'
import { copyText } from '../utils/clipboard.js'
import CustomBox from './CustomBox.vue'
import Export from './Export.vue'

const TYPES = ['Fave', 'Yes', 'Maybe', 'No']

// Each type is its own ordered box; a custom's position in its array is its
// order within that box.
const groups = reactive({ Fave: [], Yes: [], Maybe: [], No: [] })

const draft = reactive({
  name: '',
  description: '',
  type: 'Fave',
})

const nameInput = ref(null)
let nextId = 1

// --- Shareable state (URL) ------------------------------------------------
// The full working set is encoded into `?s=…`. The link below stays live, the
// address bar is kept in sync so a plain refresh/bookmark works, and loading a
// URL that carries the param rehydrates everything on mount.
const shareUrl = ref(buildShareUrl(''))
const linkCopied = ref(false)
let linkTimer

// Assign a fresh runtime id to a hydrated custom.
function withId(c) {
  return { id: nextId++, name: c.name, description: c.description }
}

onMounted(() => {
  const restored = decodeState(readStateParam())
  if (restored) {
    for (const type of TYPES) groups[type] = restored[type].map(withId)
  }

  // Keep the link + address bar in sync with any change to the customs.
  watch(
    groups,
    () => {
      const encoded = isEmpty(groups) ? '' : encodeState(groups)
      shareUrl.value = buildShareUrl(encoded)
      window.history.replaceState(null, '', shareUrl.value)
    },
    { deep: true, immediate: true }
  )
})

async function copyLink() {
  const ok = await copyText(shareUrl.value)
  if (!ok) return
  linkCopied.value = true
  clearTimeout(linkTimer)
  linkTimer = setTimeout(() => (linkCopied.value = false), 1400)
}

// The name budget depends on how wide the tag will be once this custom joins
// its box (a wider box -> wider tag -> shorter name).
const nameLimit = computed(() => maxNameLength(groups[draft.type].length + 1))
const nameLength = computed(() => draft.name.length)
const nameOver = computed(() => nameLength.value > nameLimit.value)

const canAdd = computed(() => draft.name.trim().length > 0 && !nameOver.value)

function addCustom() {
  const name = draft.name.trim()
  if (!name || nameOver.value) return

  groups[draft.type].push({
    id: nextId++,
    name,
    description: draft.description.trim(),
  })

  // Reset for the next entry, keeping the chosen type as a sensible default.
  draft.name = ''
  draft.description = ''
  nameInput.value?.focus()
}

function removeCustom(type, item) {
  const list = groups[type]
  const i = list.indexOf(item)
  if (i !== -1) list.splice(i, 1)
}
</script>

<template>
  <section class="share card card--soft">
    <div class="share__text field">
      <span class="share__label">Shareable link</span>
      <div class="d-flex gap-2">
        <input class="input share__url" :value="shareUrl" readonly @focus="$event.target.select()" />
        <button
          type="button"
          class="btn btn--primary share__copy"
          :class="{ 'btn--accent': linkCopied }"
          @click="copyLink"
          >
          {{ linkCopied ? 'Copied!' : 'Copy link' }}
        </button>
      </div>
    </div>
    <p class="share__hint">
      Nothing is saved on a server. This link <em>is</em> your save. Bookmark it
      or share it to pick up right where you left off.
    </p>
  </section>

  <section class="card card--elevated mt-3">
    <form class="custom-form" @submit.prevent="addCustom">
      <div class="field custom-form__name">
        <label class="label" for="custom-name">Name</label>
        <input
          id="custom-name"
          ref="nameInput"
          v-model="draft.name"
          class="input"
          :class="{ 'input--invalid': nameOver }"
          type="text"
          :maxlength="nameLimit"
          placeholder="e.g. Slow burn romance"
          autocomplete="off"
        />
        <small class="custom-form__hint" :class="{ 'custom-form__hint--over': nameOver }">
          {{ nameLength }} / {{ nameLimit }}
        </small>
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
          placeholder="A note about this custom. Optional."
          autocomplete="off"
        />
      </div>

      <div class="custom-form__submit">
        <button type="submit" class="btn btn--primary" :disabled="!canAdd">
          Add custom
        </button>
      </div>
    </form>
  </section>

  <div class="custom-boxes mt-4">
    <CustomBox
      v-for="t in TYPES"
      :key="t"
      :type="t"
      :items="groups[t]"
      @remove="removeCustom(t, $event)"
    />
  </div>

  <Export :groups="groups" class="mt-4" />
</template>
