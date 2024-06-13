import type { App } from 'vue'

export default {
  install(app: App) {
    let fn: (e: KeyboardEvent) => void

    app.directive('blur', {
      mounted(el: HTMLElement) {
        fn = (e: KeyboardEvent) => {
          if (e.key === 'Escape' || e.key === 'Enter') {
            el.blur()
          }
        }

        el.addEventListener('keydown', fn)
      },
      unmounted(el: HTMLElement) {
        el.removeEventListener('keydown', fn)
      }
    })
  }
}
