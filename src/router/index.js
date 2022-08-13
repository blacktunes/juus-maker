import { createRouter, createWebHistory } from 'vue-router'
import Index from '@/views/JUUs/Index.vue'

const routes = [
  {
    path: '/',
    name: 'juus',
    component: Index
  },
  {
    path: '/talk',
    name: 'talk',
    component: () => import('@/views/Talk.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
