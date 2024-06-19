import { analytics } from 'star-rail-vue'
import { createApp } from 'vue'
import blur from './assets/scripts/blur'
import { hotkey } from './assets/scripts/hotkey'
import './style.styl'
import JUUs from './views/JUUs/Index.vue'
import Talk from './views/Talk/Index.vue'

window.BUILD_TIME = new Date(BUILD_TIME)

analytics('G-ZBY4GRVH6J', import.meta.env.MODE === 'development')

createApp(import.meta.env.VITE_BUILD_MODE === 'TALK' ? Talk : JUUs)
  .use(blur)
  .mount('#app')

hotkey()
