import domtoimage from 'dom-to-image'
import { setting } from '@/store/setting'

export default function (dom, width, height) {
  setting.screenshot = true
  domtoimage
    .toPng(dom, {
      width,
      height,
      imagePlaceholder: require('@/assets/images/empty.png')
    })
    .then(dataUrl => {
      if (process.env.NODE_ENV === 'development') {
        const img = new Image()
        img.src = dataUrl
        const win = window.open('')
        win.document.body.appendChild(img)
      } else {
        const link = document.createElement('a')
        link.download = `JUUs-${Date.now()}.png`
        link.href = dataUrl
        link.click()
      }
    })
    .catch(error => {
      console.error('截图保存错误', error)
    })
    .finally(() => {
      setting.screenshot = false
    })
}
