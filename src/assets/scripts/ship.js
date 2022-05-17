const dataList = require.context('@/assets/data', false, /.json$/).keys().map(item => {
  return item.substring(2)
})

let data = {
  指挥官: {
    avatar: require('@/assets/images/commander.jpg'),
    name: '指挥官'
  }
}

let avatar = {}

dataList.forEach(name => {
  if (name === 'avatar.json') {
    avatar = require(`@/assets/data/${name}`)
  } else {
    data = { ...data, ...require(`@/assets/data/${name}`) }
  }
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
