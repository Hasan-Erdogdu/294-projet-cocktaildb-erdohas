const BASE = 'https://apis.divtec.me/api/cocktails/'

/**
 * Récupère tous les éléments d'une ressource paginée.
 * @param {number} pageLimit - Nombre de pages (total / 100, arrondi au-dessus)
 * @param {string} item - "cocktails" ou "ingredients"
 * @returns {Promise<Array>} Tous les éléments dans un seul tableau
 */
export async function fetchAll (pageLimit, item) {
  const limit = 100 // max d'éléments par page autorisé par l'API
  const res = []
  for (let currentPage = 1; currentPage <= pageLimit; ++currentPage) {
    // Pas d'await : les requêtes partent toutes en parallèle.
    // .then() convertit chaque réponse en JSON.
    res.push(fetch(`${BASE}${item}?page=${currentPage}&limit=${limit}`).then(response => response.json()))
  }
  // Attend que toutes les pages soient arrivées
  const pages = await Promise.all(res)

  // Fusionne les tableaux "data" de chaque page en un seul tableau
  return pages.flatMap(p => p.data.toLowerCase())
}
