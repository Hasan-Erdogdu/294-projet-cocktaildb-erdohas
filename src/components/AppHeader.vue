<template>
  <!-- Barre ambre : le logo noir reste lisible avec le thème sombre -->
  <v-app-bar color="primary">
    <!-- Le logo, qui ramène à l'accueil -->
    <RouterLink class="logo" to="/">
      <img alt="Cocktails – accueil" class="logo-image" src="@/img/Cocktail_Text-removebg-preview.png">
    </RouterLink>

    <v-spacer />

    <!-- Les liens vers les pages (sur téléphone, seule l'icône reste) -->
    <v-btn
      aria-label="Accueil"
      class="nav-link"
      prepend-icon="mdi-home"
      to="/"
      variant="text"
    >
      <span class="nav-label">Accueil</span>
    </v-btn>
    <v-btn
      aria-label="Vider le frigo"
      class="nav-link"
      prepend-icon="mdi-fridge-outline"
      to="/fridge"
      variant="text"
    >
      <span class="nav-label">Vider le frigo</span>
    </v-btn>
    <v-btn
      aria-label="Aléatoire"
      class="nav-link"
      prepend-icon="mdi-dice-5-outline"
      to="/aleatoire"
      variant="text"
    >
      <span class="nav-label">Aléatoire</span>
    </v-btn>
    <v-btn
      aria-label="Favoris"
      class="nav-link"
      prepend-icon="mdi-heart"
      to="/favoris"
      variant="text"
    >
      <span class="nav-label">Favoris</span>
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
  flex: none; /* le logo ne se fait jamais écraser par les liens */
  margin-left: 16px;
}

.logo-image {
  height: 40px; /* la barre fait 64px de haut */
  width: auto;  /* garde les proportions */
}

/* Tablette : logo et liens un peu plus petits */
@media (min-width: 701px) and (max-width: 960px) {
  .logo-image {
    height: 36px;
  }

  .nav-link {
    min-width: 0;
    padding: 0 10px;
    font-size: 0.8rem;
  }
}

/* Téléphone : on cache le texte des liens, il ne reste que les icônes */
@media (max-width: 700px) {
  .logo {
    margin-left: 12px;
  }

  .logo-image {
    height: 28px;
  }

  .nav-label {
    display: none;
  }

  .nav-link {
    min-width: 0;
    padding: 0 10px;
  }

  /* Enlève l'espace prévu entre l'icône et le texte caché */
  .nav-link :deep(.v-btn__prepend) {
    margin-inline: 0;
  }
}

/* Très petit téléphone : logo encore plus petit pour que tout tienne */
@media (max-width: 340px) {
  .logo-image {
    height: 24px;
  }
}
</style>
