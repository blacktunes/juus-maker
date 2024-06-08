import { reactive } from 'vue'

const tip = {
  bg: '修改背景图',
  img: '修改图片',
  screenshot: '保存截图',
  screenshotTalk: '保存对话截图'
}

const setting = reactive<{
  screenshot: boolean
  play: boolean
  interval: number
  juus: {
    home: boolean
    id?: number
    lastID: number
  }
}>({
  screenshot: false,
  play: false,
  interval: 1500,
  juus: {
    home: true,
    id: undefined,
    lastID: -1
  }
})

export { setting, tip }
