<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { maxNameLength } from '../utils/tags.js'

const props = defineProps({
  // The custom being edited, or null when the modal is closed.
  custom: { type: Object, default: null },
  // Its current box/type, or null when closed.
  type: { type: String, default: null },
  groups: { type: Object, required: true },
  types: { type: Array, required: true },
})

const emit = defineEmits(['save', 'close'])

const dialog = ref(null)
const nameInput = ref(null)

const form = reactive({ name: '', description: '', type: 'Fave' })

// Open/close the native dialog in lockstep with the `custom` prop.
watch(
  () => props.custom,
  async (custom) => {
    if (custom) {
      form.name = custom.name
      form.description = custom.description || ''
      form.type = props.type
      if (!dialog.value?.open) dialog.value?.showModal()
      await nextTick()
      nameInput.value?.focus()
      nameInput.value?.select()
    } else if (dialog.value?.open) {
      dialog.value.close()
    }
  }
)

// Editing in place keeps the box size; moving to another type adds one to the
// target box. The name budget follows that count (wider box -> shorter name).
const effectiveCount = computed(() => {
  if (!props.type) return 1
  return form.type === props.type
    ? props.groups[props.type].length
    : props.groups[form.type].length + 1
})
const nameLimit = computed(() => maxNameLength(effectiveCount.value))
const nameOver = computed(() => form.name.length > nameLimit.value)
const canSave = computed(() => form.name.trim().length > 0 && !nameOver.value)

function save() {
  if (!canSave.value) return
  emit('save', {
    name: form.name.trim(),
    description: form.description.trim(),
    type: form.type,
  })
}

// All closing routes go through emit('close') -> parent clears `editing` ->
// the watcher above closes the dialog. We deliberately do NOT rely on the
// native dialog 'close'/'cancel' events (their firing is inconsistent across
// engines); instead we intercept Esc ourselves (see @keydown in the template)
// so `editing` is always cleared and reopening the same custom works.

// Close on a backdrop click (clicks that land on the dialog element itself,
// i.e. outside the panel).
function onBackdrop(e) {
  if (e.target === dialog.value) emit('close')
}
</script>

<template>
  <dialog
    ref="dialog"
    class="modal"
    @click="onBackdrop"
    @keydown.esc.prevent="emit('close')"
  >
    <form class="modal__panel" @submit.prevent="save">
      <h2 class="modal__title">Edit custom</h2>

      <div class="field">
        <label class="label" for="edit-name">Name</label>
        <input
          id="edit-name"
          ref="nameInput"
          v-model="form.name"
          class="input"
          :class="{ 'input--invalid': nameOver }"
          type="text"
          :maxlength="nameLimit"
          autocomplete="off"
        />
        <small class="custom-form__hint" :class="{ 'custom-form__hint--over': nameOver }">
          {{ form.name.length }} / {{ nameLimit }}
        </small>
      </div>

      <div class="field">
        <label class="label" for="edit-type">Type</label>
        <div class="select">
          <select id="edit-type" v-model="form.type">
            <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
          </select>
        </div>
      </div>

      <div class="field">
        <label class="label" for="edit-desc">Description</label>
        <textarea
          id="edit-desc"
          v-model="form.description"
          class="input modal__textarea"
          rows="5"
          placeholder="A note about this custom. Optional."
        ></textarea>
      </div>

      <div class="modal__actions">
        <button type="button" class="btn btn--quiet" @click="emit('close')">Cancel</button>
        <button type="submit" class="btn btn--primary" :disabled="!canSave">Save</button>
      </div>
    </form>
  </dialog>
</template>
