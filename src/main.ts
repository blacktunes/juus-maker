import { inject } from '@vercel/analytics'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.styl'

createApp(App)
  .use(router)
  .mount('#app')

if (process.env.NODE_ENV !== 'development') {
  inject()
}
