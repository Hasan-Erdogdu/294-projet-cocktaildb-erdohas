<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  const store = useCocktailStore()
  const visibleCount = ref(10)
  const visibleIngredients = computed(() => {
    return store.ingredients.slice(0, visibleCount.value)
  })
  const selected = ref([])
</script>

<template>
  <div class="ingredients">
    <v-btn
      v-for="ingredient in visibleIngredients"
      :key="ingredient.name"
    >
      {{ ingredient.name }}
    </v-btn>
  </div>
  <v-btn v-if="visibleCount < store.ingredients.length" variant="text" @click="visibleCount += 10">
    Voir plus
  </v-btn>
</template>

<style scoped>
.ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
