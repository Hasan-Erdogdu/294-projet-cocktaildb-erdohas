import { defineStore } from 'pinia'
import api from '@/plugins/axios.js'

// Mots-clés pour reconnaître un alcool dans le nom d'un ingrédient
const ALCOHOL_KEYWORDS = [
  'vodka', 'gin', 'rum', 'tequila', 'whisk', 'bourbon', 'scotch',
  'brandy', 'cognac', 'liqueur', 'schnapps', 'vermouth', 'wine',
  'champagne', 'prosecco', 'beer', 'cider', 'sake', 'absinthe',
  'mezcal', 'pisco', 'cachaca', 'campari', 'aperol', 'amaretto',
  'kahlua', 'baileys', 'triple sec', 'cointreau', 'grand marnier', 'port', 'sherry',
]

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
    alcohols: state => state.ingredients.filter(ingredient => {
      const name = ingredient.name.toLowerCase()
      return ALCOHOL_KEYWORDS.some(keyword => name.includes(keyword))
    }),
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
      // Obligatoire d'avoir un alcool
      const alcoholIndex = Math.floor(Math.random() * this.alcohols.length)
      this.randomIngredients.push(this.alcohols[alcoholIndex])
      // Entre 2 et 8 ingrédients
      const howManyIngredients = Math.floor(Math.random() * 7 + 2)
      for (let i = 0; i < howManyIngredients; i++) {
        const index = Math.floor(Math.random() * this.ingredients.length)
        this.randomIngredients.push(this.ingredients[index])
      }
    },
  },
})
