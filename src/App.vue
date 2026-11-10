<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const store = useCocktailStore()

  // Au démarrage du site : charge les cocktails, les ingrédients et les favoris
  onMounted(async () => {
    await store.init()
  })
</script>
