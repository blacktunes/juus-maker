import { setting } from '@/store/setting'
import { screenshot } from 'star-rail-vue'
import { popupManager } from './popup'

const _screenshot = (
  dom: HTMLElement,
  config?: {
    name?: string
    width?: number
    height?: number
    download?: boolean
  }
) => {
  setting.screenshot = true
  popupManager.open('loading')

  screenshot(dom, config).finally(() => {
    setting.screenshot = false
    popupManager.close('loading')
  })
}

export { _screenshot as screenshot }
