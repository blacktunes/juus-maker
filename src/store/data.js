import { nextTick, reactive, toRaw, watch } from 'vue'

const defaultItem = {
  bg: require('@/assets/images/bg.jpg'),
  img: require('@/assets/images/img.jpg'),
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
  index: 0,
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
    const temp = []
    const request = db.transaction('data', 'readonly')
      .objectStore('data')
      .openCursor(0)
    request.onsuccess = (e) => {
      const cursor = e.target.result
      if (cursor) {
        temp.push(cursor.value.data)
        cursor.continue()
      } else {
        if (temp.length > 0) {
          data.list = temp
        }
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
      id: data.index,
      data: JSON.parse(JSON.stringify(toRaw(data.list[data.index])))
    })
}

export default data
