<script setup>
import CustomsEditor from './components/CustomsEditor.vue'
</script>

<template>
  <main class="container container--wide py-4">
    <header class="mb-4" style="max-width: 46rem;">
      <p class="eyebrow">Customs editor</p>
      <h1 class="title title--2">Build your custom kinks</h1>
      <p class="subtitle subtitle--3 mt-2 color-accent">
        Build your character's custom kinks, then export them to f-list. Every custom carries an invisible ordering tag, so they
        stay in the exact order you set here.
      </p>
    </header>

    <CustomsEditor />
  </main>
</template>