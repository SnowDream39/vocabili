
import { defineStore } from 'pinia'

export const usePageStore = defineStore('board', {
  state: () => ({name: ''})
})
