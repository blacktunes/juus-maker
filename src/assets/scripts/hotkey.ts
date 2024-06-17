import { currentJUUs } from '@/store/juus'
import { select } from '@/store/select'
import { setting } from '@/store/setting'
import { emitter } from './event'
import { popupManager } from './popup'

let flag = false

export const hotkey = () => {
  if (flag) return
  flag = true

  document.addEventListener('click', (e) => {
    if (popupManager.isLoading()) return
    if ((e.target as HTMLElement).tagName.toLowerCase() === 'a') return
    if (!setting.play) {
      popupManager.closeCurrentComponent()
    }
  })

  document.addEventListener('keydown', async (e) => {
    if (popupManager.isLoading()) return
    switch (e.key) {
      // 保存截图
      case 's':
        if (!e.ctrlKey) return
        e.preventDefault()
        if (!popupManager.hasPopup() && currentJUUs.value && !setting.juus.home) {
          emitter.emit('save_juus')
        }
        return
      case 'Enter':
        popupManager.currentComponentConfirm()
        return
      case 'Escape':
        if (setting.play) {
          emitter.emit('stop')
        } else if (!popupManager.hasPopup() && !setting.juus.home) {
          select.show = false
          setting.juus.home = true
        } else {
          popupManager.closeCurrentComponent()
        }
        return
    }
  })
}
