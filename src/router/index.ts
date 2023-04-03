import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
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
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
