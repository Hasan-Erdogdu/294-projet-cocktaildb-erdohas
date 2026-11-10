<script setup>
  import { API_BASE_URL } from '@/plugins/axios.js'
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  // Le cocktail à afficher, donné par la page parent
  defineProps({
    cocktail: {
      type: Object,
      required: true,
    },
  })

  // Le store Pinia : sert à savoir si le cocktail est en favori et à le changer
  const store = useCocktailStore()

  // Renvoie l'adresse complète d'une image à partir de son chemin
  function getImageUrl (imagePath) {
    return API_BASE_URL + imagePath
  }
</script>

<template>
  <!-- Petite carte cliquable, affichée dans les grilles -->
  <v-card hover width="200">
    <!-- Image carrée en haut de la carte -->
    <v-img
      :alt="cocktail.name"
      cover
      height="200"
      :src="getImageUrl('../..' + cocktail.image)"
    />

    <!-- Nom du cocktail et bouton cœur -->
    <v-card-title class="card-title">
      <span class="card-name" :title="cocktail.name">{{ cocktail.name }}</span>
      <!-- Cœur plein et rouge si favori, cœur vide sinon -->
      <!-- .stop : le clic sur le cœur n'ouvre pas le popup de la carte -->
      <v-btn
        :aria-label="store.isFavorite(cocktail.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'"
        :color="store.isFavorite(cocktail.id) ? 'red' : undefined"
        :icon="store.isFavorite(cocktail.id) ? 'mdi-heart' : 'mdi-heart-outline'"
        size="small"
        variant="text"
        @click.stop="store.toggleFavorite(cocktail.id)"
      />
    </v-card-title>

    <!-- Catégorie et type de verre -->
    <v-card-subtitle class="pb-3">{{ cocktail.category }} · {{ cocktail.glass }}</v-card-subtitle>
  </v-card>
</template>

<style scoped>
/* Le nom à gauche, le cœur toujours visible à droite */
.card-title {
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 4px;
}

/* Un nom trop long est coupé avec « … » au lieu de pousser le cœur dehors */
.card-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
