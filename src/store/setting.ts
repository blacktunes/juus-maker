import { reactive } from 'vue'

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

export { setting }
