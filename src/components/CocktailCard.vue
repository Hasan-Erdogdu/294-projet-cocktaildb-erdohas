<script setup>
  import { API_BASE_URL } from '@/plugins/axios.js'

  // Le cocktail à afficher, donné par le parent
  defineProps({
    cocktail: {
      type: Object,
      required: true,
    },
  })
  // Prévient le parent quand on clique sur « Fermer »
  defineEmits(['close'])

  // Renvoie l'adresse complète d'une image à partir de son chemin
  function getImageUrl (imagePath) {
    return API_BASE_URL + imagePath
  }
</script>

<template>
  <v-card>
    <div class="cocktail-layout">
      <!-- Colonne de gauche : le texte -->
      <div class="cocktail-info">
        <v-card-title>{{ cocktail.name }}</v-card-title>
        <v-card-subtitle>{{ cocktail.category }} · {{ cocktail.glass }}</v-card-subtitle>

        <v-card-text>
          <h3>Ingrédients</h3>
          <ul class="ingredient-list">
            <!-- La mesure n°index va avec l'ingrédient n°index -->
            <li
              v-for="(ingredientName, index) in cocktail.ingredients"
              :key="index"
            >
              {{ cocktail.measures[index] }} {{ ingredientName }}
            </li>
          </ul>

          <h3>Préparation</h3>
          <p>{{ cocktail.instructionsFr }}</p>
        </v-card-text>
      </div>

      <!-- Colonne de droite : l'image -->
      <v-img
        :alt="cocktail.name"
        aspect-ratio="1"
        class="cocktail-image"
        cover
        rounded="lg"
        :src="getImageUrl('../..' + cocktail.image)"
      />
    </div>

    <v-card-actions>
      <v-spacer />
      <v-btn text="Fermer" @click="$emit('close')" />
    </v-card-actions>
  </v-card>
</template>

<style scoped>
/* Texte à gauche, image à droite */
.cocktail-layout {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
}

.cocktail-info {
  flex: 1;
  min-width: 0;
}

.cocktail-image {
  flex: 0 0 340px; /* largeur fixe de 340px */
}

.ingredient-list {
  margin: 8px 0 16px;
  padding-left: 20px;
}

/* Téléphone : l'image passe au-dessus du texte */
@media (max-width: 700px) {
  .cocktail-layout {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .cocktail-image {
    flex: none;
    width: 100%;
    max-width: 340px;
    margin: 0 auto;
  }
}

/* Tablette : l'image reste à droite, mais plus petite */
@media (min-width: 701px) and (max-width: 960px) {
  .cocktail-image {
    flex: none;
    width: 240px;
  }
}
</style>
