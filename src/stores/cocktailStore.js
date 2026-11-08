import { defineStore } from 'pinia'
import api from '@/plugins/axios.js'
import { CATEGORIES, categoryOf } from '@/utils/ingredientCategories.js'

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
    /**
     * Regroupe tous les ingrédients par catégorie (pour la page « Vider le frigo »).
     * @param {Object} state - L'état du store
     * @returns {Object<string, Array>} Un objet avec une liste par catégorie :
     *   { spirits, liqueurs, softs, fruits, kitchen, others }
     */
    ingredientsByCategory: state => {
      const groups = { others: [] }
      for (const category of CATEGORIES) {
        groups[category.id] = []
      }
      for (const ingredient of state.ingredients) {
        groups[categoryOf(ingredient.name)].push(ingredient)
      }
      return groups
    },

    /**
     * Les ingrédients qui contiennent de l'alcool
     * (alcools forts + liqueurs, vins et bières).
     * @param {Object} state - L'état du store
     * @returns {Array} Les ingrédients alcoolisés
     */
    alcohols: state => state.ingredients.filter(ingredient =>
      ['spirits', 'liqueurs'].includes(categoryOf(ingredient.name)),
    ),

    /**
     * Les ingrédients sans alcool (softs, fruits, herbes, épices…).
     * @param {Object} state - L'état du store
     * @returns {Array} Les ingrédients non alcoolisés
     */
    mixers: state => state.ingredients.filter(ingredient =>
      !['spirits', 'liqueurs'].includes(categoryOf(ingredient.name)),
    ),
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
      // vérifie si tous les ingrédients ont déjà été chargés
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
      if (this.ingredients.length === 0 || this.alcohols.length === 0) {
        this.error = 'Les ingrédients ne sont pas chargés.'
        return
      }
      this.randomIngredients = [] // repart d'une liste vide à chaque tirage
      // Obligatoire d'avoir un alcool
      const alcoholIndex = Math.floor(Math.random() * this.alcohols.length)
      this.randomIngredients.push(this.alcohols[alcoholIndex])
      // Entre 2 et 8 ingrédients au total (l'alcool compte comme le 1er)
      const howManyIngredients = Math.floor(Math.random() * 7 + 2)
      for (let i = 1; i < howManyIngredients; i++) {
        const index = Math.floor(Math.random() * this.ingredients.length)
        this.randomIngredients.push(this.ingredients[index])
      }
    },
  },
})
