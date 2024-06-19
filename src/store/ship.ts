import shipData from '@/assets/data/ship.json'
import commander from '@/assets/images/commander.webp'

const ship = reactive<{
  player: ShipData
  game: ShipData[]
  custom: ShipData<number>[]
}>({
  player: {
    key: '指挥官',
    avatar: commander,
    name: '你',
    alias: '',
    nickname: '指挥官',
    data: {
      param1: '',
      param2: '',
      param3: '',
      param4: ''
    }
  },
  game: shipData as ShipData[],
  custom: []
})

export { ship }

