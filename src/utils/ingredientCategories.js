/**
 * Classe les ingrédients de l'API en catégories pour la page « Vider le frigo ».
 *
 * Chaque ingrédient est testé contre les catégories DANS L'ORDRE :
 * la première dont un mot-clé correspond gagne.
 * Ex. « Lime vodka » contient « lime » et « vodka » → les alcools forts
 * sont testés en premier, donc il y va.
 */

// Les catégories, dans l'ordre où elles sont testées
export const CATEGORIES = [
  {
    id: 'spirits',
    label: 'Alcools forts',
    keywords: [
      'vodka', 'absolut', 'gin', 'rum', 'bacardi', 'cachaca', 'tequila', 'mezcal',
      'pisco', 'whiskey', 'whisky', 'scotch', 'bourbon', 'rye', 'crown royal',
      'jack daniels', 'jim beam', 'johnnie walker', 'wild turkey', 'brandy',
      'cognac', 'applejack', 'absinthe', 'everclear', 'grain alcohol', 'firewater',
    ],
  },
  {
    id: 'liqueurs',
    label: 'Liqueurs, vins & bières',
    keywords: [
      'liqueur', 'schnapps', 'creme de', 'irish cream', 'baileys', 'amaretto',
      'kahlua', 'tia maria', 'frangelico', 'galliano', 'godiva', 'drambuie',
      'benedictine', 'chartreuse', 'cointreau', 'grand marnier', 'triple sec',
      'curacao', 'cherry heering', 'chambord', 'midori', 'southern comfort',
      'yukon jack', 'goldschlager', 'hot damn', 'rumple minze', 'jagermeister',
      'jägermeister', 'hpnotiq', 'pisang ambon', 'passoa', 'sambuca', 'anisette',
      'ouzo', 'pernod', 'ricard', 'apfelkorn', 'advocaat', 'amaro', 'campari',
      'aperol', 'vermouth', 'lillet', 'dubonnet', 'st. germain', 'falernum',
      'bitters', 'wine', 'champagne', 'prosecco', 'port', 'sherry', 'cider',
      'beer', 'ale', 'lager', 'guinness', 'corona', 'zima',
    ],
  },
  {
    id: 'softs',
    label: 'Sans alcool',
    keywords: [
      'juice', 'nectar', 'soda', 'cola', 'coca-cola', 'pepsi', 'sprite', '7-up',
      'dr. pepper', 'mountain dew', 'surge', 'fresca', 'sarsaparilla', 'tonic',
      'bitter lemon', 'schweppes', 'lemonade', 'limeade', 'water', 'syrup', 'sirup',
      'cordial', 'grenadine', 'sour mix', 'sweet and sour', 'daiquiri mix',
      'pina colada mix', 'fruit punch', 'kool-aid', 'soft drink', 'tea', 'coffee',
      'espresso', 'hot chocolate', 'milk', 'cream', 'half-and-half', 'yoghurt',
    ],
  },
  {
    id: 'fruits',
    label: 'Fruits & herbes',
    keywords: [
      'lime', 'lemon', 'orange', 'apple', 'banana', 'cherry', 'cherries', 'berries',
      'strawberries', 'blackberries', 'cranberries', 'grapes', 'kiwi', 'mango',
      'papaya', 'pineapple', 'cantaloupe', 'figs', 'fruit', 'cucumber', 'olive',
      'mint', 'rosemary', 'thyme', 'lavender', 'rose', 'ginger',
    ],
  },
  {
    id: 'kitchen',
    label: 'Épices, sucre & cuisine',
    keywords: [
      'sugar', 'salt', 'pepper', 'chili', 'cinnamon', 'nutmeg', 'cloves', 'cardamom',
      'allspice', 'anis', 'coriander', 'cumin', 'asafoetida', 'vanilla', 'honey',
      'flavoring', 'coloring', 'egg', 'butter', 'chocolate', 'cocoa', 'ice', 'jello',
      'marshmallows', 'oreo', 'sherbet', 'sauce', 'wormwood', 'angelica',
    ],
  },
]

// Exceptions : noms qui tomberaient dans la mauvaise catégorie avec les mots-clés
// (« beer » et « ale » les enverraient dans les bières alors qu'ils sont sans alcool,
// et « cream » mettrait les glaces avec les boissons)
const OVERRIDES = {
  'root beer': 'softs',
  'ginger beer': 'softs',
  'ginger ale': 'softs',
  'chocolate ice-cream': 'kitchen',
  'vanilla ice-cream': 'kitchen',
}

/**
 * Vérifie si un mot-clé apparaît comme MOT ENTIER dans le nom.
 * Ex. « gin » trouve « Sloe gin » mais pas « Ginger ».
 */
function hasWord (name, keyword) {
  // Échappe les caractères spéciaux (le « . » de « dr. pepper » par ex.)
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  return new RegExp(`\\b${escaped}\\b`).test(name)
}

/**
 * Renvoie l'id de la catégorie d'un ingrédient ('spirits', 'softs', … ou 'others').
 * @param {string} ingredientName - le nom de l'ingrédient, ex. "Lime juice"
 */
export function categoryOf (ingredientName) {
  const name = ingredientName.toLowerCase()
  if (OVERRIDES[name]) {
    return OVERRIDES[name]
  }
  const found = CATEGORIES.find(category =>
    category.keywords.some(keyword => hasWord(name, keyword)),
  )
  return found ? found.id : 'others'
}
