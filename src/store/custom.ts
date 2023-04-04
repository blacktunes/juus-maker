import { nextTick, ref, toRaw, watch } from 'vue'

const data = ref<ShipData[]>([])

const setWatch = () => {
  watch(data.value, () => {
    nextTick(() => {
      updateDB()
    })
  })
}

let hasDB = true
let db: IDBDatabase

export const updateDB = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: JSON.stringify(toRaw(data.value))
    })
}

export const getDB = () => {
  console.log('GET - Custom indexDB...')
  const _db = window.indexedDB.open('custom')
  _db.onsuccess = event => {
    db = (event.target as IDBOpenDBRequest).result
    if (hasDB) {
      db.transaction('data', 'readonly')
        .objectStore('data')
        .get(0)
        .onsuccess = (e) => {
          try {
            data.value = JSON.parse((e.target as IDBRequest).result?.data || '[]')
          } finally {
            setWatch()
          }
        }
    } else {
      updateDB()
      setWatch()
    }
  }

  _db.onupgradeneeded = event => {
    db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

export default data
