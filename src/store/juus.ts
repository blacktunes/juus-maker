import { reactive } from 'vue'
import { setting } from './setting'
import { ship } from './ship'

export const getMessage = <T extends string | number>(
  key: T,
  text = ''
): ShipData<T> & { text: string } => {
  if (key === '指挥官') {
    return {
      text,
      ...ship.player as ShipData<T>
    }
  }

  const gameIndex = ship.game.findIndex((item) => item.key === key)
  if (gameIndex !== -1) {
    return {
      text,
      ...ship.game[gameIndex] as ShipData<T>
    }
  } else {
    const customIndex = ship.custom.findIndex((item) => item.key === key)
    if (customIndex !== -1) {
      return {
        text,
        ...ship.custom[customIndex] as ShipData<T>
      }
    } else {
      return {
        text,
        key,
        avatar: '',
        name: '',
        alias: '',
        nickname: '',
        data: {
          param1: '',
          param2: '',
          param3: '',
          param4: ''
        }
      }
    }
  }
}

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
  juus: getMessage('塔什干', '北方联合的兔兔，超凶，嘎哦！'),
  comment: [
    {
      ...getMessage('U-110', '嘎哦！~'),
      reply: [getMessage('塔什干', '嘎哦！！')]
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
