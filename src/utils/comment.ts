import axios from "axios"


const api = axios.create({
  baseURL: 'https://api.vocabili.top',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

interface CommentPost {
  content: string,
  article_id: string
}


export const post = async (form: CommentPost) => {
  const response = await api.post('/user/comments/', form)
  return response.data
}

export const getByArticleId = async (article_id: string) => {
  const response = await api.get(`/user/comments/by_article/${article_id}`)
  return response.data
}

export const postLike = async (comment_id: number) => {
  console.log(comment_id)
  const response = await api.post(`/user/likes`, {comment_id})
  return response.data
}

export const deleteLike = async (comment_id: number) => {
  const response = await api.delete(`/user/likes/${comment_id}`)
  return response.data
}
