<script setup>
  import { useCocktailStore } from "@/stores/cocktailStore.js";

  const store = useCocktailStore()
</script>

<template>
  <v-btn variant="text" @click="store.pickRandomCocktail()">COCKTAIL ALEATOIRE</v-btn>
  <p v-if="store.randomCocktail">{{ store.randomCocktail.name }}</p>

  <v-btn variant="text" @click="store.pickRandomIngredients()">INGREDIENTS ALEATOIRE</v-btn>
  <ul v-if="store.randomIngredients.length > 0">
    <li v-for="(ingredient, i) in store.randomIngredients" :key="i">{{ ingredient.name }}</li>
  </ul>
</template>
<style>
</style>
