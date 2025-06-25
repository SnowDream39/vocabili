
import { defineStore } from 'pinia'

export const useStatusStore = defineStore('board', {
  state: () => ({
    articleId: '',
    userName: '',
    isSuperUser: false,
  })
})
