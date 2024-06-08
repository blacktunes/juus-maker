import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.styl'

window.BUILD_TIME = new Date(BUILD_TIME)

createApp(App)
  .use(router)
  .mount('#app')
