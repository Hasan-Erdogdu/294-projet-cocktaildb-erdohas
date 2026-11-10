// src/plugins/axios.js
import axios from 'axios'

// L'adresse de l'API, lue dans le fichier .env (elle n'est pas écrite dans le code)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3535'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'fr',
  },
})

// On exporte l'instance pour l'utiliser partout : import api from '@/plugins/axios'
export default api
