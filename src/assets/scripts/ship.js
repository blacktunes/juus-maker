import { reactive } from 'vue'

const dataList = require.context('@/assets/data', false, /.txt$/).keys().map(item => {
  return item.substring(2)
})

const loadTxt = text => {
  const list = {}
  let group = ''
  let type = ''

  text.split('\n').forEach(item => {
    if (item.startsWith('===')) {
      type = item.replaceAll('=', '').replace('\r', '')
      return
    }
    if (item.startsWith('==')) {
      group = item.replaceAll('=', '').replace('阵营', '').replace('\r', '')
      return
    }
    if (item.includes('@')) {
      const temp = item.replace(/\{|\}|小图标\||<br>/g, '').replace('\r', '').split('@')
      const key = temp[0].split('|')[0]
      list[key] = {
        avatar: '',
        name: temp[1],
        type,
        group
      }
    }
  })

  return list
}

const avatar = require('@/assets/data/avatar.json')

let data = reactive({
  指挥官: {
    avatar: require('@/assets/images/commander.jpg'),
    name: '指挥官'
  }
})

dataList.forEach(name => {
  data = { ...data, ...loadTxt(require(`@/assets/data/${name}`).txt) }
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
