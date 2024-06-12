import { getData } from '@/assets/data'
import { reactive } from 'vue'
import { setting } from './setting'

export const defaultBg =
  'https://patchwiki.biligame.com/images/blhx/e/e8/bhdanvql92zw4a24kv7xcif6i6rlbqk.png'

export const defaultItem: JUUsData = {
  id: 0,
  time: 0,
  img: 'https://patchwiki.biligame.com/images/blhx/d/d7/47ho3fxsc16dnjl59ivd6uf4j1pmaw6.png',
  bg: 'https://patchwiki.biligame.com/images/blhx/e/e8/bhdanvql92zw4a24kv7xcif6i6rlbqk.png',
  like: {
    flag: false,
    num: '0',
    ellipsis: false
  },
  juus: getData('塔什干', '北方联合的兔兔，超凶，嘎哦！'),
  comment: [
    {
      ...getData('U-110', '嘎哦！~'),
      reply: [getData('塔什干', '嘎哦！！')]
    }
  ]
}

export const getDefaultJUUs = () => ({
  ...JSON.parse(JSON.stringify(defaultItem)),
  ...{ id: Date.now(), time: Date.now() }
})

export const data = reactive<{
  juus: JUUsData[]
}>({
  juus: [getDefaultJUUs()]
})

export const currentJUUs = computed<JUUsData | undefined>(() => {
  const index = data.juus.findIndex((item) => item.id === setting.juus.id)
  if (index === -1) return
  return data.juus[index]
})
