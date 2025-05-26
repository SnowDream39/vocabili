import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Board from '../views/Board.vue'
import Song from '../views/Song.vue'
import Search from '../views/Search.vue'
import Artist from '../views/Artist.vue'
import Pool from '../views/Pool.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/board/:boardId/:issue?', component: Board },
  { path: '/about', component: About },
  { path: '/song/:id', component: Song },
  { path: '/search', component: Search },
  { path: '/artist/:type/:id', component: Artist } ,
  { path: '/pool', component: Pool },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router