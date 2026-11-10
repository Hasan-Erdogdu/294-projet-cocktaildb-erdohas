<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'
  const store = useCocktailStore()
  const router = useRouter()
  const showSearch = ref(false)
  const searchTerm = ref('') // ce que l'utilisateur tape
  function goToSearch () {
    const term = searchTerm.value.trim()
    if (term === '') {
      return
    }
    router.push(`/search?term=${term}`)
    showSearch.value = false
  }
</script>

<template>
  <v-app-bar>
    <!-- Le logo, qui ramène à l'accueil -->
    <v-app-bar-title>
      <RouterLink class="logo" to="/">
        <img alt="Cocktails – accueil" class="logo-image" src="@/img/Cocktail_Text-removebg-preview.png">
      </RouterLink>
    </v-app-bar-title>

    <v-spacer />

    <!-- Les liens vers les pages -->
    <v-btn to="/" variant="text">Accueil</v-btn>
    <v-btn to="/fridge" variant="text">Vider le frigo</v-btn>
    <v-btn to="/aleatoire" variant="text">Aléatoire</v-btn>
    <v-btn to="/favoris" variant="text">Favoris</v-btn>
  </v-app-bar>
</template>

<style scoped>
.logo {
  display: inline-flex;
  align-items: center;
}

.logo-image {
  height: 40px; /* la barre fait 64px de haut */
  width: auto;  /* garde les proportions */
}
</style>
