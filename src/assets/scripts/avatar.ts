import { ship } from '@/store/ship'
import { imageCompress } from 'star-rail-vue'

export const urlToBase64 = (url: string, base64?: boolean) => {
  return new Promise<string>((resolve) => {
    fetch(url).then((res) =>
      res.blob().then((blob) => {
        if (base64) {
          imageCompress(blob).then((img) => {
            resolve(img)
          })
        } else {
          resolve(URL.createObjectURL(blob))
        }
      })
    )
  })
}

export const getAvatarBase64 = async (key: string) => {
  const index = ship.game.findIndex((item) => item.key === key)
  if (index !== -1 && ship.game[index].avatar.startsWith('http')) {
    try {
      ship.game[index].avatar = await urlToBase64(ship.game[index].avatar, true)
    } catch {
      /* empty */
    }
  }
  return ship.game[index]?.avatar || ''
}
