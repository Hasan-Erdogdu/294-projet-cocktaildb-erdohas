import { defineStore } from 'pinia'

import axios from '@/plugins/axios.js'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL })

/**
 * Récupère tous les éléments d'une ressource paginée.
 * @param {number} pageLimit - Nombre de pages (total / 100, arrondi au-dessus)
 * @param {string} item - "cocktails" ou "ingredients"
 * @returns {Promise<Array>} Tous les éléments dans un seul tableau
 */
export async function fetchAll (pageLimit, item) {
  const limit = 100 // max d'éléments par page autorisé par l'API
  const response = []
  for (let currentPage = 1; currentPage <= pageLimit; ++currentPage) {
    response.push(api.get(`/${item}?page=${currentPage}&limit=${limit}`))
  }
  // Attend que toutes les pages soient arrivées
  const pages = await Promise.all(response).catch(console.error)

  // Fusionne les tableaux "data" de chaque page en un seul tableau
  return pages.flatMap(p => p.data.data)
}

export const useCocktailStore = defineStore('store', {
  state: () => ({
    cocktails: [],
    ingredients: [],
    randomCocktail: null,
    randomIngredients: [],
  }),
  getters: {
    cocktailCount () {
      return this.cocktails.length
    },
    ingredientsCount () {
      return this.ingredients.length
    },
    searchByName (name) {
      return this.cocktails.filter((cocktail) =>
        cocktail.toLowerCase().includes(name.value.toLowerCase()),
      )
    },
    byIngredient (ingredient) {
      return this.cocktails.filter((cocktail) =>
        cocktail.includes(cocktail.ingredients.some(ingredient))
      )
    },


  },
  actions: {
    async init () {
      // charge cocktails et ingrédients en parallèle
      await Promise.all([this.loadCocktails(), this.loadIngredients()])
    },
    async loadCocktails () {
      // vérifie si tous les cocktails on déjà été chargé
      if (this.cocktails.length < 441) {
        this.cocktails = await fetchAll(5, 'cocktails')
      }
    },
    async loadIngredients () {
      // vérifie si tous les ingrédients on déjà été chargé
      if (this.ingredients.length < 310) {
        this.ingredients = await fetchAll(4, 'ingredients')
      }
    },
    async pickRandomCocktail () {
      if (this.randomCocktail === null) {
        await this.loadCocktails()
        const index = Math.floor(Math.random() * this.cocktails.length)
        this.randomCocktail = this.cocktails[index]
      }
    },
    async pickRandomIngredients () {
      if (this.loadIngredients().length < this.ingredients.length) {
        await this.loadIngredients()
        const howManyIngredients = Math.floor(Math.random() * 9 + 2)
        for (let i = 0; i < howManyIngredients; i++) {
          const index = Math.floor(Math.random() * this.ingredients.length)
          this.randomIngredients.push(this.ingredients[index])
        }
      }
    },

  },

})
