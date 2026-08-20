<script setup>
// Remove all existing custom kinks
document.querySelectorAll('#CustomKinksList .del.list-item-important').forEach((el) => el.click());

// foreach custom do the below

// Add a new custom kink
document.querySelectorAll('#customs-button-add').click();

const newCustom = document.querySelector('.CustomKink.CustomKinkActive:not(#CustomKink_TEMPLATE_):last-of-type')

if (newCustom) {
  const nameInput = newCustom.querySelector('[name="customkinkname[]"]');
  const descInput = newCustom.querySelector('[name="customkinkdescription[]"]');
  const choiceInput = newCustom.querySelector('[name="customkinkchoice[]"]'); // options are literally "fave", "yes", "maybe" and "no"

  if (nameInput) nameInput.value = 'Custom kink name';
  if (descInput) descInput.value = 'Custom kink description';
  if (choiceInput) choiceInput.value = 'no';
}

</script>

<template>

</template>