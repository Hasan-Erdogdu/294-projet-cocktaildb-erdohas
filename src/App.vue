<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const useStore = useCocktailStore()

  onMounted(async () => {
    await useStore.init()
  })
</script>
