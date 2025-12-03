import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: () => import('../views/Home.vue') },
  { path: '/board/:name/:issue?', component: () => import('../views/BoardV2.vue') },
  { path: '/about', component: () => import('../views/About.vue') },
  { path: '/song/:id', component: () => import('../views/SongV2.vue') },
  { path: '/search', component: () => import('../views/Search.vue') },
  { path: '/artist/:type/:id', component: () => import('../views/Artist.vue') } ,
  { path: '/pool', component: () => import('../views/Pool.vue') },
  { path: '/top5', component: () => import('../views/Top.vue')},
  { path: '/work', component: () => import('../views/Work.vue')},
  { path: '/user', component: () => import('../views/User.vue')},
  { path: '/calculator', component: () => import('../views/Calculator.vue')},
  { path: '/settings', component: () => import('../views/Settings.vue')},
  { path: '/admin', component: () => import('../views/admin/Index.vue')},
  { path: '/admin/comment', component: () => import('../views/admin/Comment.vue')},
  { path: '/admin/user', component: () => import('../views/admin/User.vue')},
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
