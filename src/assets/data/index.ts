import custom from '@/store/custom'
import { reactive } from 'vue'
import shipData from '@/assets/data/ship.json'
import commander from '@/assets/images/commander.jpg'

const data = reactive<ShipData[]>(shipData as ShipData[])

const getData = (
  key: string,
  text = '',
  defaultUser?: { name: string; avatar: string }
): ShipData & { text: string } => {
  if (key === '指挥官') {
    return {
      key,
      text,
      avatar: defaultUser?.avatar || commander,
      name: defaultUser?.name || '指挥官',
      alias: '',
      data: {
        param1: '',
        param2: '',
        param3: '',
        param4: ''
      }
    }
  }

  if (key === '自定义') {
    return {
      empty: true,
      key,
      text,
      avatar: '',
      name: '',
      alias: '',
      data: {
        param1: '',
        param2: '',
        param3: '',
        param4: ''
      }
    }
  }

  let index = data.findIndex((item) => item.key === key)
  if (index === -1) {
    index = custom.value.findIndex((item) => item.key === key)

    return {
      text,
      ...(index !== -1
        ? custom.value[index]
        : {
            empty: true,
            avatar: '',
            name: '',
            alias: '',
            data: {
              param1: '',
              param2: '',
              param3: '',
              param4: ''
            }
          }),
      key
    }
  } else {
    return {
      text,
      ...data[index],
      key
    }
  }
}

export { getData }
export default data
