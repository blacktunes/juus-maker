const dataList = require.context('@/assets/data', false, /.json$/).keys().map(item => {
  return item.substring(2)
})

let data = {
  指挥官: {
    avatar: require('@/assets/images/commander.jpg'),
    name: '指挥官'
  }
}

dataList.forEach(name => {
  data = { ...data, ...require(`@/assets/data/${name}`) }
})

const getData = (name) => {
  return data[name]
    ? data[name]
    : { avatar: '', name: '' }
}

export { getData }
export default data
