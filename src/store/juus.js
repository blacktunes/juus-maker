import { nextTick, reactive, toRef, toRaw, watch } from 'vue'
import { getData } from '@/assets/data'
import { setting } from './setting'

export const defaultItem = {
  img: 'https://patchwiki.biligame.com/images/blhx/d/d7/47ho3fxsc16dnjl59ivd6uf4j1pmaw6.png',
  bg: 'https://patchwiki.biligame.com/images/blhx/e/e8/bhdanvql92zw4a24kv7xcif6i6rlbqk.png',
  like: {
    flag: false,
    text: '999+'
  },
  time: '刚刚',
  juus: getData('塔什干', '北方联合的兔兔，超凶，嘎哦！'),
  comment: [
    {
      ...getData('U-110', '嘎哦！~'),
      reply: [
        getData('塔什干', '嘎哦！！')
      ]
    }
  ]
}

const data = reactive({
  home: true,
  index: 0,
  bg: 'https://patchwiki.biligame.com/images/blhx/e/e8/bhdanvql92zw4a24kv7xcif6i6rlbqk.png',
  list: [
    JSON.parse(JSON.stringify(defaultItem))
  ]
})

const setWatch = () => {
  data.index = localStorage.getItem('juus-last-index') || 0

  watch(data.list, () => {
    if (setting.play) return

    nextTick(() => {
      updateDB()
    })
  })

  const index = toRef(data, 'index')
  watch(index, () => {
    localStorage.setItem('juus-last-index', data.index)
  })
}

let hasDB = true
let db

export const updateDB = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: JSON.stringify(toRaw(data.list))
    })
}

export const getDB = () => {
  console.log('GET - JUUs indexedDB...')
  const _db = window.indexedDB.open('juus', 1)
  _db.onsuccess = event => {
    db = event.target.result

    if (hasDB) {
      const request = db.transaction('data', 'readonly')
        .objectStore('data')
        .get(0)
      request.onsuccess = (e) => {
        try {
          data.list = JSON.parse(e.target.result?.data || '[]')
        } finally {
          setWatch()
        }
      }
    } else {
      updateDB()
      setWatch()
      data.home = false
    }
  }

  _db.onupgradeneeded = (e) => {
    db = e.target.result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

export default data
