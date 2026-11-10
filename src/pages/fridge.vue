<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  import { CATEGORIES } from '@/utils/ingredientCategories.js'
  const store = useCocktailStore()
  const visibleCount = ref({
    spirits: 10,
    liqueurs: 10,
    softs: 10,
    fruits: 10,
    kitchen: 10,
  })
  const selected = ref([])
  // Les cocktails qui contiennent tous les ingrédients choisis
  const results = computed(() =>
    selected.value.length === 0 ? [] : store.searchByIngredients(selected.value),
  )
  // Les ingrédients affichés d'une catégorie (coupés selon son compteur)
  function visibleIngredients (categoryId) {
    return store.ingredientsByCategory[categoryId].slice(0, visibleCount.value[categoryId])
  }
  // Clic sur un ingrédient : on l'enlève s'il est déjà choisi, sinon on l'ajoute
  function toggleSelected (ingredientName) {
    selected.value = selected.value.includes(ingredientName)
      ? selected.value.filter(name => name !== ingredientName)
      : [...selected.value, ingredientName]
  }
</script>

<template>
  <h1 class="text-h3 text-center my-6">Vider le frigo</h1>

  <div class="fridge-layout">
    <!-- Colonne de gauche : les ingrédients à choisir -->
    <div class="fridge-selection">
      <div v-for="category in CATEGORIES" :key="category.id" class="allCategories">
        <v-banner
          bg-color="transparent"
          border="b"
          rounded="0"
        >
          {{ category.label }}
        </v-banner>

        <div class="ingredients">
          <v-btn
            v-for="ingredient in visibleIngredients(category.id)"
            :key="ingredient.name"
            class="buttons"
            :color="selected.includes(ingredient.name) ? 'primary' : undefined"
            :prepend-icon="selected.includes(ingredient.name) ? 'mdi-check' : undefined"
            @click="toggleSelected(ingredient.name)"
          >
            {{ ingredient.name }}
          </v-btn>
        </div>

        <v-btn
          v-if="visibleCount[category.id] < store.ingredientsByCategory[category.id].length"
          variant="text"
          @click="visibleCount[category.id] += 10"
        >
          Voir plus !
        </v-btn>
      </div>
    </div>

    <!-- Colonne de droite : les ingrédients choisis et les cocktails trouvés -->
    <aside class="fridge-results">
      <div v-if="selected.length > 0" class="selection">
        <v-chip
          v-for="ingredientName in selected"
          :key="ingredientName"
          closable
          color="primary"
          @click:close="toggleSelected(ingredientName)"
        >
          {{ ingredientName }}
        </v-chip>
        <v-btn size="small" variant="text" @click="selected = []">
          Tout effacer
        </v-btn>
      </div>

      <!-- Cas if : rien de choisi -->
      <p v-if="selected.length === 0">
        Choisis des ingrédients pour voir les cocktails.
      </p>

      <!-- Cas else-if : choisi, mais aucun cocktail -->
      <p v-else-if="results.length === 0">
        Aucun cocktail ne contient tous ces ingrédients.
      </p>

      <!-- Cas else : il y a des résultats -->
      <div v-else>
        <p>{{ results.length }} cocktail(s)</p>
        <div class="results">
          <v-dialog
            v-for="cocktail in results"
            :key="cocktail.id"
            max-width="820"
            scrollable
          >
            <template #activator="{ props: activatorProps }">
              <SmallCocktailCard v-bind="activatorProps" :cocktail="cocktail" />
            </template>
            <template #default="{ isActive }">
              <CocktailCard :cocktail="cocktail" @close="isActive.value = false" />
            </template>
          </v-dialog>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
/* Sélection à gauche, résultats à droite */
.fridge-layout {
  display: grid;
  grid-template-columns: 1fr 440px;
  gap: 32px;
  align-items: start;
}

.fridge-results {
  position: sticky;
  top: 80px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.selection {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.results {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.allCategories {
  margin-bottom: 40px;
}

.v-banner {
  padding: 8px 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Les ingrédients : 3 colonnes */
.ingredients {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  justify-items: start;
  gap: 8px;
  margin-bottom: 12px;
}

.buttons {
  justify-content: flex-start;
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}

/* Écran étroit : les résultats repassent sous la sélection */
@media (max-width: 960px) {
  .fridge-layout {
    grid-template-columns: 1fr;
  }

  .fridge-results {
    position: static;
    max-height: none;
  }
}

/* Téléphone : 2 colonnes d'ingrédients */
@media (max-width: 600px) {
  .ingredients {
    grid-template-columns: repeat(2, max-content);
  }
}
</style>
