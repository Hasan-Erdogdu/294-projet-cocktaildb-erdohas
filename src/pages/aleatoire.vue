<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const store = useCocktailStore()
  // true = le popup du cocktail aléatoire est ouvert
  const showRandomCocktail = ref(false)
  // Tire un cocktail au hasard, puis ouvre le popup
  function drawRandomCocktail () {
    store.pickRandomCocktail()
    showRandomCocktail.value = true
  }
</script>

<template>
  <h1 class="text-h3 text-center my-6">Aléatoire</h1>

  <!-- Cocktail aléatoire -->
  <section class="random-section">
    <h2>Un cocktail au hasard</h2>
    <p>Le bar choisit pour toi.</p>
    <v-btn color="primary" @click="drawRandomCocktail">
      Cocktail aléatoire
    </v-btn>

    <!-- Le popup avec la recette du cocktail tiré -->
    <v-dialog v-model="showRandomCocktail" max-width="820" scrollable>
      <CocktailCard
        v-if="store.randomCocktail"
        :cocktail="store.randomCocktail"
        @close="showRandomCocktail = false"
      />
    </v-dialog>
  </section>

  <!-- Ingrédients aléatoires -->
  <section class="random-section">
    <h2>Des ingrédients au hasard</h2>
    <p>Un alcool garanti, le reste au hasard. À tes risques et périls.</p>
    <v-btn color="primary" @click="store.pickRandomIngredients()">
      {{ store.randomIngredients.length > 0 ? 'Encore !' : 'Ingrédients aléatoires' }}
    </v-btn>

    <div v-if="store.randomIngredients.length > 0" class="random-ingredients">
      <!-- Le 1er ingrédient est l'alcool garanti : il est coloré -->
      <v-chip
        v-for="(ingredient, index) in store.randomIngredients"
        :key="ingredient.name"
        :color="index === 0 ? 'primary' : undefined"
      >
        {{ ingredient.name }}
      </v-chip>
    </div>
  </section>
</template>

<style scoped>
.random-section {
  margin: 32px 0;
  text-align: center;
}

.random-ingredients {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
}
</style>
