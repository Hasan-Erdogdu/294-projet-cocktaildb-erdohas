<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  defineProps({
    cocktail: {
      type: Object,
      required: true,
    },
  })
  const store = useCocktailStore()
  const IMAGE_BASE_URL = import.meta.env.VITE_API_URL
  function getImageUrl (imagePath) {
    return IMAGE_BASE_URL + imagePath
  }
</script>

<template>
  <v-card hover width="200">
    <v-img
      :alt="cocktail.name"
      cover
      height="200"
      :src="getImageUrl('../..' + cocktail.image)"
    />
    <v-card-title>
      {{ cocktail.name }}
      <v-btn
        :aria-label="store.isFavorite(cocktail.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :color="store.isFavorite(cocktail.id) ? 'red' : undefined"
        :icon="store.isFavorite(cocktail.id) ? 'mdi-heart' : 'mdi-heart-outline'"
        size="small"
        variant="text"
        @click.stop="store.toggleFavorite(cocktail.id)"
      />
    </v-card-title>
    <v-card-subtitle class="pb-3">{{ cocktail.category }} · {{ cocktail.glass }}</v-card-subtitle>
  </v-card>
</template>

<style scoped>
.v-img {
  aspect-ratio: 1;
}
</style>
