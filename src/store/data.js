import { reactive } from 'vue'

const data = reactive({
  bg: require('@/assets/images/bg.jpg'),
  img: require('@/assets/images/img.jpg'),
  like: {
    flag: false,
    text: '999+'
  },
  time: '刚刚',
  juus: {
    avatar: '',
    name: '',
    text: ''
  },
  comment: []
})

export default data
