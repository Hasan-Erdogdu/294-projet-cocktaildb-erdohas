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
</template>

<style scoped lang="sass">

</style>
