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
    favoriteIds: [],
  }),
  getters: {
    /**
     * Cherche les cocktails dont le nom contient le texte tapé (sans tenir compte des majuscules).
     * @param {Object} state - L'état du store
     * @returns {function(string): Array} Une fonction qui prend le texte et renvoie les cocktails trouvés
     */
    searchByName: state => name => {
      const drinkName = name.toLowerCase()
      return state.cocktails.filter(cocktail => cocktail.name.toLowerCase().includes(drinkName))
    },
    /**
     * Cherche les cocktails qui contiennent TOUS les ingrédients choisis.
     * @param {Object} state - L'état du store
     * @returns {function(string[]): Array} Une fonction qui prend les noms choisis et renvoie les cocktails
     */
    searchByIngredients: state => selectedNames => {
      // Les noms choisis, en minuscules pour ignorer les majuscules
      const wantedNames = selectedNames.map(name => name.toLowerCase())
      return state.cocktails.filter(cocktail => {
        // Les ingrédients de ce cocktail, en minuscules aussi
        const cocktailNames = new Set(cocktail.ingredients.map(name => name.toLowerCase()))
        // Gardé seulement s'il contient chaque ingrédient choisi
        return wantedNames.every(name => cocktailNames.has(name))
      })
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
     * Vérifie si un cocktail est dans les favoris.
     * @param {Object} state - L'état du store
     * @returns {function(*): boolean} Une fonction qui prend l'id du cocktail
     */
    isFavorite: state => cocktailId => state.favoriteIds.includes(cocktailId),
    /**
     * La liste des cocktails favoris.
     * @param {Object} state - L'état du store
     * @returns {Array} Les cocktails dont l'id est dans favoriteIds
     */
    favoriteCocktails: state => state.cocktails.filter(cocktail =>
      state.favoriteIds.includes(cocktail.id),
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
      return pages.flatMap(page => page.data.data)
    },
    /**
     * Lance le chargement au démarrage du site : favoris, cocktails et ingrédients.
     * isLoading repasse à false à la fin, même en cas d'erreur.
     * @returns {Promise<void>}
     */
    async init () {
      this.isLoading = true
      this.error = null
      this.loadFavorites()

      try {
        await Promise.all([this.loadCocktails(), this.loadIngredients()])
      } catch (error) {
        this.error = error.message
      } finally {
        this.isLoading = false
      }
    },
    /**
     * Charge les cocktails, seulement si la liste est encore vide.
     * @returns {Promise<void>}
     */
    async loadCocktails () {
      if (this.cocktails.length === 0) {
        this.cocktails = await this.fetchAll(5, 'cocktails')
      }
    },
    /**
     * Charge les ingrédients, seulement si la liste est encore vide.
     * @returns {Promise<void>}
     */
    async loadIngredients () {
      if (this.ingredients.length === 0) {
        this.ingredients = await this.fetchAll(4, 'ingredients')
      }
    },
    /**
     * Lit les favoris sauvegardés dans le localStorage du navigateur.
     */
    loadFavorites () {
      try {
        const savedText = localStorage.getItem('favoriteIds')
        const savedIds = savedText ? JSON.parse(savedText) : []
        // Si ce qui est sauvegardé n'est pas une liste, on repart de zéro
        this.favoriteIds = Array.isArray(savedIds) ? savedIds : []
      } catch (error) {
        console.error('Impossible de lire les favoris', error)
        this.favoriteIds = []
      }
    },
    /**
     * Choisit un cocktail au hasard et le met dans randomCocktail.
     */
    pickRandomCocktail () {
      // Liste vide -> message d'erreur et on s'arrête
      if (this.cocktails.length === 0) {
        this.error = 'Les cocktails ne sont pas chargés.'
        return
      }
      const index = Math.floor(Math.random() * this.cocktails.length)
      this.randomCocktail = this.cocktails[index]
    },

    /**
     * Crée une liste aléatoire d'ingrédients dans randomIngredients :
     * 1 alcool obligatoire, puis entre 2 et 8 ingrédients au total, sans doublon.
     */
    pickRandomIngredients () {
      if (this.ingredients.length === 0 || this.alcohols.length === 0) {
        this.error = 'Les ingrédients ne sont pas chargés.'
        return
      }
      // Obligatoire d'avoir un alcool : il est toujours le 1er de la liste
      const alcoholIndex = Math.floor(Math.random() * this.alcohols.length)
      const pickedIngredients = [this.alcohols[alcoholIndex]]
      // Entre 2 et 8 ingrédients au total (l'alcool compte comme le 1er)
      const howManyIngredients = Math.floor(Math.random() * 7 + 2)
      while (pickedIngredients.length < howManyIngredients) {
        const index = Math.floor(Math.random() * this.ingredients.length)
        const candidate = this.ingredients[index]
        // On ne garde pas deux fois le même ingrédient
        if (!pickedIngredients.includes(candidate)) {
          pickedIngredients.push(candidate)
        }
      }
      this.randomIngredients = pickedIngredients
    },
    /**
     * Ajoute le cocktail aux favoris s'il n'y est pas, sinon le retire,
     * puis sauvegarde la liste dans le localStorage.
     * @param {*} cocktailId - L'id du cocktail
     */
    toggleFavorite (cocktailId) {
      if (this.favoriteIds.includes(cocktailId)) {
        this.favoriteIds = this.favoriteIds.filter(favoriteId => favoriteId !== cocktailId)
      } else {
        this.favoriteIds.push(cocktailId)
      }

      try {
        localStorage.setItem('favoriteIds', JSON.stringify(this.favoriteIds))
      } catch (error) {
        console.error('Impossible de sauvegarder les favoris', error)
      }
    },
  },
})
