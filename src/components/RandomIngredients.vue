<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  const store = useCocktailStore()
</script>

<template>
  <v-dialog max-width="500">
    <template #activator="{ props : activatorProps }">

    </template>
  </v-dialog>
</template>

<style scoped>
  .container {
    background-color: limegreen;
    border-style: dashed;
    border-radius: 20px;
  }
  ul {
    list-style-type: none;
  }
</style>

<div class="container">
<ul v-if="store.randomIngredients.length > 0">
  <li v-for="(ingredient, i) in store.randomIngredients" :key="i">{{ ingredient.name }}</li>
</ul>
</div>
