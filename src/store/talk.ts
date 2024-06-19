import { nextTick, reactive, toRaw, watch } from 'vue'
import { setting } from './setting'
import input from './input'
import commander from '@/assets/images/commander.webp'

export const defaultItem: Omit<TalkData, 'time'> = {
  title: '谢谢你，碧蓝航线',
  list: []
}

const data = reactive<{
  home: boolean
  name: {
    name: string
    avatar: string
  }
  index: number
  list: TalkData[]
}>({
  home: true,
  name: {
    name: '指挥官',
    avatar: commander
  },
  index: 0,
  list: []
})

const setTalkWatch = () => {
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
let db: IDBDatabase

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
  console.log('GET - Talk indexDB...')
  const _db = window.indexedDB.open('talk')

  _db.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result

    if (hasDB) {
      db.transaction('data', 'readonly').objectStore('data').get(0).onsuccess = (e) => {
        try {
          data.list = JSON.parse((e.target as IDBRequest).result?.data || '[]')
        } finally {
          setTalkWatch()
        }
      }

      db.transaction('data', 'readonly').objectStore('data').get(1).onsuccess = (e) => {
        try {
          const user = JSON.parse((e.target as IDBRequest).result?.data || 'false')
          if (user) {
            data.name = user
            input.name = data.name.name
            input.avatar = data.name.avatar
          }
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

  _db.onupgradeneeded = (event) => {
    db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

export default data
