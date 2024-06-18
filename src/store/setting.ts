import { reactive } from 'vue'
import { resetFilterData, resetSelectData } from './select'

const setting = reactive<{
  screenshot: boolean
  play: boolean
  interval: number
  juus: {
    home: boolean
    id?: number
    lastID: number
  }
  download: boolean
}>({
  screenshot: false,
  play: false,
  interval: 1500,
  juus: {
    home: true,
    id: undefined,
    lastID: -1
  },
  download: true
})

try {
  const _setting = JSON.parse(localStorage.getItem('juus-setting') || '{}')
  if (_setting.download !== undefined) {
    setting.download = _setting.download
  }
} finally {
  watch([() => setting.download], () => {
    localStorage.setItem(
      'sr-light-cone-setting',
      JSON.stringify({
        download: setting.download
      })
    )
  })
}

watch(
  () => setting.juus.home,
  () => {
    if (setting.juus.home) {
      setting.play = false
      resetSelectData()
      resetFilterData()
    }
  }
)

export { setting }

