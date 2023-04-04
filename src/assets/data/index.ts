import custom from '@/store/custom'
import { reactive } from 'vue'

const data = reactive<ShipData[]>(require('@/assets/data/ship.json'))

const getData = (key: string, text = ''): ShipData & { text: string } => {
  if (key === '指挥官') {
    return {
      key,
      text,
      avatar: require('@/assets/images/commander.jpg'),
      name: '指挥官',
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

  let index = data.findIndex(item => item.key === key)
  if (index === -1) {
    index = custom.value.findIndex(item => item.key === key)

    return {
      text,
      ...(
        index !== -1
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
            }
      ),
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
