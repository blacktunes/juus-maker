import { currentJUUs, data, defaultBg } from '@/store/data'
import { setting } from '@/store/setting'

export const JUUsList = computed(() => data.juus.sort((a, b) => b.time - a.time))

export const currentBg = computed(() => {
  if (currentJUUs.value) return currentJUUs.value.bg
  if (data.juus[setting.juus.lastID]?.bg) return data.juus[setting.juus.lastID].bg
  if (JUUsList.value[0]?.bg) return JUUsList.value[0].bg
  return defaultBg
})
