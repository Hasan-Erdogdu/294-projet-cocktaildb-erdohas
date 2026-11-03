<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  const store = useCocktailStore()
  const searchTerm = ref('') // ce que l'utilisateur tape

  // Se recalcule à chaque frappe
  const results = computed(() => store.searchByName(searchTerm.value || ''))
</script>

<template>
  <v-text-field
    v-model="searchTerm"
    clearable
    label="Rechercher un cocktail"
    prepend-inner-icon="mdi-magnify"
  />

  <p>{{ results.length }} cocktail(s)</p>

  <ul>
    <li v-for="c in results" :key="c.id">{{ c.name }}</li>
  </ul>
  <v-btn variant="text" @click="store.pickRandomCocktail()">COCKTAIL ALEATOIRE</v-btn>
</template>
