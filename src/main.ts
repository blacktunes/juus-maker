import { createApp } from 'vue'
import JUUs from './views/JUUs/Index.vue'
import Talk from './views/Talk/Index.vue'
import './style.styl'
import blur from './assets/scripts/blur'

window.BUILD_TIME = new Date(BUILD_TIME)

createApp(import.meta.env.VITE_BUILD_MODE === 'TALK' ? Talk : JUUs)
  .use(blur)
  .mount('#app')
