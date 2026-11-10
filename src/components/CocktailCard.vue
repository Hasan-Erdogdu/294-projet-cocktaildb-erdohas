<script setup>
  defineProps({
    cocktail: {
      type: Object,
      required: true,
    },
  })
  const IMAGE_BASE_URL = import.meta.env.VITE_API_URL
  function getImageUrl (imagePath) {
    return IMAGE_BASE_URL + imagePath
  }
</script>

<template>
  <v-card hover>
    <v-img
      :alt="cocktail.name"
      cover
      height="200"
      :src="getImageUrl(cocktail.image)"
    />
    <v-card-title>{{ cocktail.name }}</v-card-title>
    <v-card-subtitle>{{ cocktail.category }} · {{ cocktail.glass }}</v-card-subtitle>
  </v-card>
</template>
