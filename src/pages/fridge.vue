<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  import { CATEGORIES } from '@/utils/ingredientCategories.js'

  const store = useCocktailStore()
  const visibleCount = ref(10)
  const visibleIngredients = computed(() => {
    return store.ingredients.slice(0, visibleCount.value)
  })
  const selected = ref([])
</script>

<template>
  <div class="ingredients">
    <v-banner
      v-for="category in CATEGORIES"
      :key="category.id"
      bg-color="transparent"
      border="b"
      class="v-banner"
      rounded="0"
    >{{ category.label }}
    </v-banner>
  </div>
</template>

<style scoped>
.v-banner {
  display: flex;
  justify-content: flex-start;
  margin: 0;
}
.ingredients {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>

<!--
<v-btn v-if="visibleCount < store.ingredients.length" variant="text" @click="visibleCount += 10">
Voir plus
</v-btn>
<v-btn
      v-for="ingredient in visibleIngredients"
      :key="ingredient.name"
    >
      {{ ingredient.name }}
    </v-btn>
-->
