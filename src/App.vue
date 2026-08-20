<script setup>
import CustomsEditor from './components/CustomsEditor.vue'
</script>

<template>
  <main class="container py-5" style="max-width: 46rem;">
    <header class="mb-4">
      <p class="eyebrow">Customs editor</p>
      <h1 class="title title--2">Sort your customs</h1>
      <p class="subtitle subtitle--3 mt-2">
        Build your character's custom kinks, then copy each one over to the
        roleplay site. Every custom carries an invisible ordering tag, so they
        stay in the exact order you set here.
      </p>
    </header>

    <CustomsEditor />
  </main>
</template>