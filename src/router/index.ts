import { createWebHistory, createRouter } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'juus',
    component: () => import('@/views/JUUs/Index.vue')
  },
  {
    path: '/talk',
    name: 'talk',
    component: () => import('@/views/Talk/Index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
