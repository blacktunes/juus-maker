import { nextTick, reactive, toRaw, watch } from 'vue'
import { setting } from './setting'

export const defaultItem = {
  title: '谢谢你，碧蓝航线',
  list: []
}

const data = reactive({
  home: true,
  name: {
    name: '指挥官',
    avatar: require('@/assets/images/commander.jpg')
  },
  index: 0,
  list: []
})

watch(() => data.home, () => {
  if (data.home) {
    data.list.sort((a, b) => b.time - a.time)
  }
})

const setTalkWatch = () => {
  data.list.sort((a, b) => b.time - a.time)

  watch(data.list, () => {
    if (setting.play) return

    nextTick(() => {
      updateTalk()
    })
  })
}

const setNameWatch = () => {
  watch(data.name, () => {
    if (setting.play) return

    nextTick(() => {
      updateName()
    })
  })
}

let hasDB = true
let db

const updateTalk = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: JSON.stringify(toRaw(data.list))
    })
}

const updateName = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 1,
      data: JSON.stringify(toRaw(data.name))
    })
}

export const getDB = () => {
  console.log('GET - Talk indexedDB...')
  const _db = window.indexedDB.open('talk')

  _db.onsuccess = event => {
    db = event.target.result

    if (hasDB) {
      db.transaction('data', 'readonly')
        .objectStore('data')
        .get(0)
        .onsuccess = (e) => {
          try {
            data.list = JSON.parse(e.target.result?.data || '[]')
          } finally {
            setTalkWatch()
          }
        }

      db.transaction('data', 'readonly')
        .objectStore('data')
        .get(1)
        .onsuccess = (e) => {
          try {
            data.name = JSON.parse(e.target.result?.data || '{}')
          } finally {
            setNameWatch()
          }
        }
    } else {
      updateTalk()
      updateName()
      setTalkWatch()
      setNameWatch()
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
