import { reactive } from 'vue'

const avatar = require('@/assets/data/avatar.json')

const data = reactive({
  指挥官: {
    avatar: require('@/assets/images/commander.jpg'),
    name: '指挥官'
  },
  自定义: {
    avatar: '',
    name: '自定义'
  },
  ...require('@/assets/data/ship.json')
})

for (const key in data) {
  if (avatar[key]) data[key].avatar = avatar[key]
}

const getData = (key, text) => {
  return {
    key,
    text,
    ...(
      data[key]
        ? { avatar: data[key].avatar, name: data[key].name }
        : { avatar: '', name: '' }
    )
  }
}

export { getData }
export default data
