<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  import { CATEGORIES } from '@/utils/ingredientCategories.js'

  const store = useCocktailStore()

  // Combien d'ingrédients sont affichés, pour chaque catégorie
  const visibleCount = ref({
    spirits: 10,
    liqueurs: 10,
    softs: 10,
    fruits: 10,
    kitchen: 10,
  })
  const selected = ref([])

  // Les ingrédients affichés d'une catégorie (coupés selon son compteur)
  function visibleIngredients (categoryId) {
    return store.ingredientsByCategory[categoryId].slice(0, visibleCount.value[categoryId])
  }
  function toggleSelected (ingredientName) {
    selected.value = selected.value.includes(ingredientName)
      ? selected.value.filter(name => name !== ingredientName)
      : [...selected.value, ingredientName]
  }
</script>

<template>
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
      @click="visibleCount[category.id] += 10"
    >
      Voir plus !
    </v-btn>
  </div>
</template>

<style scoped>
/* Une section par catégorie, avec de l'air entre elles */
.allCategories {
  margin-bottom: 40px;
}

/* Le titre de la catégorie */
.v-banner {
  padding: 8px 0;
  margin-bottom: 16px;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

/* Les ingrédients : 4 colonnes */
.ingredients {
  display: grid;
  grid-template-columns: repeat(4, max-content);
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

/* Tablette : 3 colonnes */
@media (max-width: 960px) {
  .ingredients {
    grid-template-columns: repeat(3, max-content);
  }
}

/* Téléphone : 2 colonnes */
@media (max-width: 600px) {
  .ingredients {
    grid-template-columns: repeat(2, max-content);
  }
}
</style>
