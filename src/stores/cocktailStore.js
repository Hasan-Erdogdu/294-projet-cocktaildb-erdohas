const BASE = 'https://apis.divtec.me/api/cocktails/'

export async function searchByName (name) {
  const res = await fetch(`${BASE}/cocktails?name=${name}`)
  return await res.json()
}
