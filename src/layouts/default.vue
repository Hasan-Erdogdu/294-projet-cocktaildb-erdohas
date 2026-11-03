<script setup>
  import { useCocktailStore } from '@/stores/cocktailStore.js'

  const store = useCocktailStore()
</script>

<template>
  <app-header />
  <v-main>
    <!-- 1. Chargement des données -->
    <v-container>
      <div v-if="store.isLoading" class="text-center py-12">
        <v-progress-circular color="primary" indeterminate size="64" />
        <p>Chargement des cocktails...</p>
      </div>
      <!-- 2. Erreur -->
      <v-alert
        v-else-if="store.error"
        title="Impossible de charger les éléments"
        type="error"
        variant="tonal"
      >
        {{ store.error }}
        <template #append>
          <v-btn variant="text" @click="store.init()">Réessayer</v-btn>
        </template>
      </v-alert>
      <!-- Affichage de la page -->
      <div v-else>
        <router-view />
      </div>
    </v-container>
  </v-main>

  <AppFooter />
</template>
