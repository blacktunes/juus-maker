import { setting } from '@/store/setting'
import { screenshot as _screenshot } from 'star-rail-vue'
import { popupManager } from './popup'

const screenshot = (
  dom: HTMLElement,
  config?: {
    width?: number
    height?: number
  }
) => {
  setting.screenshot = true
  popupManager.open('loading')

  _screenshot(dom, { ...config, name: 'JUUs', download: setting.download })
    .catch(() => {
      popupManager.open('confirm', {
        text: ['图片保存异常', '请尝试在设置中切换下载模式']
      })
    })
    .finally(() => {
      setting.screenshot = false
      popupManager.close('loading')
    })
}

export { screenshot }
