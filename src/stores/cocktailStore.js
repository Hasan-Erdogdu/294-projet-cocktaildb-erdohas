// stores/cocktailStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchAll } from '@/stores/cocktailAPI.js'

export const useCocktailStore = defineStore('cocktails', () => {
  const cocktails = ref([])

  async function loadCocktails () {
    // fetch seulement si la liste est encore vide
    if (cocktails.value.length === 0) {
      cocktails.value = await fetchAll(5, 'cocktails')
    }
  }

  async function randomCocktail () {
    await loadCocktails() // ne fetch que si la liste est vide
    const list = cocktails.value
    return list[Math.floor(Math.random() * list.length)]
  }

  return { cocktails, loadCocktails, randomCocktail }
})
