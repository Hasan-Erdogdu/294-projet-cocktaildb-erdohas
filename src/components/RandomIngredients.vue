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
