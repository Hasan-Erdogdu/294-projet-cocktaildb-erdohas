<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const store = useCocktailStore()
</script>

<template>
  <h1 class="text-h3 text-center my-6">Mes favoris</h1>

  <p v-if="store.favoriteCocktails.length === 0" class="text-center">
    Aucun favori pour l'instant. Clique sur le cœur d'un cocktail pour l'ajouter.
  </p>

  <div v-else class="cocktail-grid">
    <v-dialog
      v-for="cocktail in store.favoriteCocktails"
      :key="cocktail.id"
      max-width="820"
      scrollable
    >
      <!-- Ce qu'on clique : la petite carte -->
      <template #activator="{ props: activatorProps }">
        <SmallCocktailCard v-bind="activatorProps" :cocktail="cocktail" />
      </template>

      <!-- Le popup : la carte complète -->
      <template #default="{ isActive }">
        <CocktailCard :cocktail="cocktail" @close="isActive.value = false" />
      </template>
    </v-dialog>
  </div>
</template>

<style scoped>
.cocktail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
