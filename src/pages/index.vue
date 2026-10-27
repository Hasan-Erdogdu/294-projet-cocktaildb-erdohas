<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const useStore = useCocktailStore()

  onMounted(async () => {
    await useStore.init()
  })
</script>

<template>
  <div>
    <p>Oui bonjour</p>
  </div>
</template>
