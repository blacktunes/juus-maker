import { nextTick, reactive, toRaw, watch } from 'vue'

const defaultItem = {
  img: require('@/assets/images/img.jpg'),
  bg: require('@/assets/images/bg.jpg'),
  like: {
    flag: false,
    text: '999+'
  },
  time: '刚刚',
  juus: {
    key: '',
    avatar: '',
    name: '',
    text: ''
  },
  comment: []
}

const data = reactive({
  home: true,
  index: 0,
  bg: require('@/assets/images/bg.jpg'),
  list: [
    { ...defaultItem }
  ]
})

const setWatch = () => {
  watch(data.list, () => {
    nextTick(() => {
      updateDB()
    })
  })
}

let hasDB = true
let db
const _db = window.indexedDB.open('juus', 1)
_db.onsuccess = function (event) {
  db = event.target.result

  if (hasDB) {
    const request = db.transaction('data', 'readonly')
      .objectStore('data')
      .get(0)
    request.onsuccess = (e) => {
      try {
        data.list = JSON.parse(e.target.result.data)
      } finally {
        setWatch()
      }
    }
  } else {
    updateDB()
    setWatch()
  }
}

_db.onupgradeneeded = (e) => {
  db = e.target.result
  if (!db.objectStoreNames.contains('data')) {
    hasDB = false
    db.createObjectStore('data', { keyPath: 'id' })
  }
}

export const updateDB = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: JSON.stringify(toRaw(data.list))
    })
}

export default data
