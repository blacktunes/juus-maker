const dataList = require.context('@/assets/data', false, /.json$/).keys().map(item => {
  return item.substring(2)
})

let data = {}

dataList.forEach(name => {
  data = { ...data, ...require(`@/assets/data/${name}`) }
})

export default data
