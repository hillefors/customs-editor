<script setup>
import { computed, ref } from 'vue'
import { taggedName } from '../utils/tags.js'
import { copyText } from '../utils/clipboard.js'
import { isEmpty } from '../utils/share.js'

const props = defineProps({
  groups: { type: Object, required: true },
})

const TYPES = ['Fave', 'Yes', 'Maybe', 'No']

// Flatten the boxes into the payload the site needs: each custom's name gets
// its invisible ordering tag baked in, and the type maps to the site's choice
// value ("fave" | "yes" | "maybe" | "no").
const entries = computed(() => {
  const out = []
  for (const type of TYPES) {
    const list = props.groups[type] || []
    list.forEach((c, i) => {
      out.push({
        n: taggedName(c.name, i, list.length),
        d: c.description || '',
        c: type.toLowerCase(),
      })
    })
  }
  return out
})

const empty = computed(() => isEmpty(props.groups))
const count = computed(() => entries.value.length)

// The console snippet, with the current customs baked in as data. Built by
// concatenation (not a template literal) so the `+`-joined runtime strings are
// evaluated in the SITE's console, not here.
const script = computed(() => {
  const data =
    '[\n' +
    entries.value.map((e) => '    ' + JSON.stringify(e)).join(',\n') +
    '\n  ]'

  return [
    '/*',
    ' * Customs editor -> roleplay site push.',
    ' * Run this in the browser console (F12) while on your character\'s',
    ' * customs page, logged in. It DELETES every existing custom and rebuilds',
    ' * them from the editor. Nothing is saved until you click the site\'s own',
    ' * Save button afterwards.',
    ' */',
    '(async () => {',
    '  const CUSTOMS = ' + data + ';',
    '',
    '  const addBtn = document.querySelector("#customs-button-add");',
    '  if (!addBtn) {',
    '    alert("Could not find the customs UI. Are you on your character\'s customs page?");',
    '    return;',
    '  }',
    '',
    '  if (!confirm("This DELETES all existing customs on this page and replaces them with " + CUSTOMS.length + " from the editor. Continue?")) return;',
    '',
    '  const wait = (ms) => new Promise((r) => setTimeout(r, ms));',
    '  const waitFor = async (fn, tries = 60, ms = 50) => {',
    '    for (let i = 0; i < tries; i++) { const v = fn(); if (v) return v; await wait(ms); }',
    '    return null;',
    '  };',
    '',
    '  // Set a value the way a framework-controlled input expects: native setter',
    '  // + input/change events, or the field reverts to empty on save.',
    '  const setValue = (el, value) => {',
    '    const proto = el.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype',
    '      : el.tagName === "SELECT" ? HTMLSelectElement.prototype',
    '      : HTMLInputElement.prototype;',
    '    const setter = Object.getOwnPropertyDescriptor(proto, "value").set;',
    '    setter.call(el, value);',
    '    el.dispatchEvent(new Event("input", { bubbles: true }));',
    '    el.dispatchEvent(new Event("change", { bubbles: true }));',
    '  };',
    '',
    '  const rows = () => document.querySelectorAll(".CustomKink.CustomKinkActive:not(#CustomKink_TEMPLATE_)");',
    '',
    '  // 1. Purge existing customs.',
    '  document.querySelectorAll("#CustomKinksList .del.list-item-important").forEach((el) => el.click());',
    '  await waitFor(() => rows().length === 0);',
    '',
    '  // 2. Add each custom, in order, and fill its fields.',
    '  for (const k of CUSTOMS) {',
    '    const before = rows().length;',
    '    addBtn.click();',
    '    const row = await waitFor(() => (rows().length > before ? rows()[rows().length - 1] : null));',
    '    if (!row) { console.warn("Row never appeared for", k.n); continue; }',
    '    const name = row.querySelector(\'[name="customkinkname[]"]\');',
    '    const desc = row.querySelector(\'[name="customkinkdescription[]"]\');',
    '    const choice = row.querySelector(\'[name="customkinkchoice[]"]\');',
    '    if (name) setValue(name, k.n);',
    '    if (desc) setValue(desc, k.d);',
    '    if (choice) setValue(choice, k.c);',
    '  }',
    '',
    '  console.log("Filled " + CUSTOMS.length + " customs. Review them, then click the site\'s Save button.");',
    '})();',
    '',
  ].join('\n')
})

const copied = ref(false)
let copiedTimer

async function copyScript() {
  const ok = await copyText(script.value)
  if (!ok) return
  copied.value = true
  clearTimeout(copiedTimer)
  copiedTimer = setTimeout(() => (copied.value = false), 1600)
}
</script>

<template>
  <section class="export card card--danger">
    <div class="export__head">
      <div>
        <span class="export__label">Push to the site</span>
        <p class="export__hint">
          Copies a console script that rebuilds your customs on <b>f-list</b>. <br />
          Open your character's edit page, press F12, paste into the Console, and run it. Then click the site's own Save button.
        </p>

        <div class="export__warning">
          <strong>Warning:</strong> This is a DESTRUCTIVE operation that DELETES all existing customs and replaces them with the ones from this editor. Test it on a throwaway character first if you're unsure. <br />
          Nothing is saved until you press Save on the site.
        </div>
      </div>
      <button
        type="button"
        class="btn btn--danger export__copy"
        :class="{ 'btn--outline': copied }"
        :disabled="empty"
        @click="copyScript"
      >
        {{ copied ? 'Copied!' : 'Copy console script' }}
      </button>
    </div>

  </section>
</template>
