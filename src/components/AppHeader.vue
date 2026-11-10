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
    <!-- Mode recherche : le champ remplace tout le reste -->
    <template v-if="showSearch">
      <v-icon class="ml-4" icon="mdi-magnify" />
      <input
        v-model="searchTerm"
        autofocus
        class="search-input"
        placeholder="Retrouver vos cocktails..."
        type="text"
        @keyup.enter="goToSearch"
        @keyup.esc="showSearch = false"
      >
      <v-btn aria-label="Fermer la recherche" icon="mdi-close" @click="showSearch = false" />
    </template>

    <!-- Mode normal : le header habituel -->
    <template v-else>
      <v-app-bar-title>
        <RouterLink class="logo" to="/">Cocktails</RouterLink>
      </v-app-bar-title>
      <v-spacer />
      <v-btn to="/" variant="text">Accueil</v-btn>
      <v-btn to="/fridge" variant="text">Vider le frigo</v-btn>
      <v-btn to="/aleatoire" variant="text">Aléatoire</v-btn>
      <v-btn aria-label="Rechercher" icon="mdi-magnify" @click="showSearch = true" />
    </template>
  </v-app-bar>
</template>

<style scoped>
.search-input {
  flex: 1;
  margin: 0 12px;
  background: transparent;
  border: none;
  outline: none;
  color: inherit;
  font-size: 1.1rem;
}

</style>
