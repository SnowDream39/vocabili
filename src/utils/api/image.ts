import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_IMAGE_API_BASE_URL
})

export async function getImageSets() {
  const response = await api.get('/list.json')
  return response.data
}

export async function getImageSet(name: string) {
  const response = await api.get(`/${name}.json`)
  return response.data
}

