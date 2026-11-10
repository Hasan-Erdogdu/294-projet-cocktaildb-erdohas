<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  const store = useCocktailStore()

  // Combien de cocktails sont affichés (441 d'un coup, c'est trop lourd)
  const visibleCount = ref(24)

  // Seulement les premiers cocktails, selon visibleCount
  const visibleCocktails = computed(() => store.cocktails.slice(0, visibleCount.value))
</script>

<template>
  <h1 class="text-h3 text-center my-6">Cocktails</h1>

  <div class="cocktail-grid">
    <v-dialog
      v-for="cocktail in visibleCocktails"
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

  <div v-if="visibleCount < store.cocktails.length" class="text-center my-6">
    <v-btn variant="text" @click="visibleCount += 24">Voir plus</v-btn>
  </div>
</template>

<style scoped>
/* Les cartes gardent leur taille et passent à la ligne */
.cocktail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
