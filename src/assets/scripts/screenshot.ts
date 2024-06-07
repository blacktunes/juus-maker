import { toPng } from 'html-to-image'
import { setting } from '@/store/setting'
import { nextTick } from 'vue'

export default function (dom: HTMLElement, width?: number, height?: number) {
  setting.screenshot = true

  nextTick(() => {
    toPng(dom, {
      width,
      height
    })
      .then((dataUrl) => {
        const title = `JUUs-${Date.now()}`
        if (import.meta.env.MODE === 'development') {
          const img = new Image()
          img.src = dataUrl
          img.alt = title
          const win = window.open('')
          if (win) win.document.body.appendChild(img)
        } else {
          const link = document.createElement('a')
          link.download = `${title}.png`
          link.href = dataUrl
          link.click()
        }
      })
      .catch((error) => {
        console.error('截图保存错误', error)
      })
      .finally(() => {
        setting.screenshot = false
      })
  })
}
