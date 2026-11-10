  <script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const store = useCocktailStore()
  // Ce que l'utilisateur tape dans la recherche
  const searchTerm = ref('')
  const visibleCount = ref(24)
  // Les cocktails dont le nom contient le texte tapé (tous si le champ est vide)
  const matchingCocktails = computed(() => store.searchByName(searchTerm.value || ''))
  // Seulement les premiers, selon visibleCount
  const visibleCocktails = computed(() => matchingCocktails.value.slice(0, visibleCount.value))
  watch(searchTerm, () => {
    visibleCount.value = 24
  })
</script>

<template>
  <h1 class="text-h3 text-center my-6">Cocktails</h1>

  <!-- La recherche : filtre les cocktails à chaque frappe -->
  <v-text-field
    v-model="searchTerm"
    class="search-field"
    clearable
    hide-details
    label="Rechercher un cocktail"
    prepend-inner-icon="mdi-magnify"
  />

  <!-- Aucun résultat -->
  <p v-if="matchingCocktails.length === 0" class="text-center my-6">
    Aucun cocktail trouvé.
  </p>

  <!-- Les cocktails -->
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

  <div v-if="visibleCount < matchingCocktails.length" class="text-center my-6">
    <v-btn variant="text" @click="visibleCount += 24">Voir plus</v-btn>
  </div>
</template>

<style scoped>
.search-field {
  max-width: 480px;
  margin: 0 auto 24px;
}

.cocktail-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: center;
}
</style>
