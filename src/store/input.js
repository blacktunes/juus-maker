import { reactive } from 'vue'

const input = reactive({
  key: '指挥官',
  avatar: require('@/assets/images/commander.jpg'),
  name: '指挥官',
  text: ''
})

const select = reactive({
  show: false,
  type: 0,
  index: 0,
  key: 0
})

const resetSelectData = () => {
  select.show = false
  select.type = 0
  select.index = 0
  select.key = 0
}

export { select, resetSelectData }
export default input
