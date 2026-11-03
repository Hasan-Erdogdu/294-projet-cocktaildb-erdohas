import { defineStore } from 'pinia'
import api from '@/plugins/axios.js'

export const useCocktailStore = defineStore('store', {
  state: () => ({
    cocktails: [],
    ingredients: [],
    randomCocktail: null,
    randomIngredients: [],
    isLoading: true,
    error: null,
  }),
  getters: {
    cocktailCount: state => {
      return state.cocktails.length
    },
    ingredientCount: state => {
      return state.ingredients.length
    },
    searchByName: state => name => {
      const drinkName = name.toLowerCase()
      return state.cocktails.filter(c => c.name.toLowerCase().includes(drinkName))
    },
  },
  actions: {
    /**
     * Récupère tous les éléments d'une ressource paginée.
     * @param {number} pageLimit - Nombre de pages (total / 100, arrondi au-dessus)
     * @param {string} item - "cocktails" ou "ingredients"
     * @returns {Promise<Array>} Tous les éléments dans un seul tableau
     */
    async fetchAll (pageLimit, item) {
      const limitOfItems = 100 // max d'éléments par page autorisé par l'API
      const response = []
      for (let currentPage = 1; currentPage <= pageLimit; ++currentPage) {
        response.push(api.get(`/${item}`, { params: { page: currentPage, limit: limitOfItems } }))
      }
      // Attend que toutes les pages soient arrivées
      const pages = await Promise.all(response)

      // Fusionne les tableaux "data" de chaque page en un seul tableau
      return pages.flatMap(p => p.data.data)
    },
    async init () {
      this.isLoading = true
      this.error = null

      try {
        await Promise.all([this.loadCocktails(), this.loadIngredients()])
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    async loadCocktails () {
      // vérifie si tous les cocktails ont déjà été chargés
      if (this.cocktails.length === 0) {
        this.cocktails = await this.fetchAll(5, 'cocktails')
      }
    },
    async loadIngredients () {
      // vérifie si tous les ingrédients on déjà été chargé
      if (this.ingredients.length === 0) {
        this.ingredients = await this.fetchAll(4, 'ingredients')
      }
    },
    async pickRandomCocktail () {
      // Liste vide -> message d'erreur et on s'arrête
      if (this.cocktails.length === 0) {
        this.error = 'Les cocktails ne sont pas chargés.'
        return
      }
      const index = Math.floor(Math.random() * this.cocktails.length)
      this.randomCocktail = this.cocktails[index]
    },

    async pickRandomIngredients () {
      if (this.ingredients.length === 0) {
        this.error = 'Les ingrédients ne sont pas chargés.'
        return
      }
      this.randomIngredients = [] // repart d'une liste vide à chaque tirage
      // Entre 2 et 10 ingrédients
      const howManyIngredients = Math.floor(Math.random() * 9 + 2)
      for (let i = 0; i < howManyIngredients; i++) {
        const index = Math.floor(Math.random() * this.ingredients.length)
        this.randomIngredients.push(this.ingredients[index])
      }
    },
  },
})
