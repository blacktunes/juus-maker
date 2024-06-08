/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ReplyItem {
  key: string
  avatar: string
  name: string
  text: string
  img?: string
}

type JUUsComment = ReplyItem & { reply: ReplyItem[] }

interface JUUsData {
  id: number
  time: number
  img: string
  bg: string
  like: {
    flag: boolean
    text: string
  }
  juus: ReplyItem
  comment: JUUsComment[]
}

interface TalkData {
  title: string
  time: number
  list: ReplyItem[]
}

type ShipLevel = '普通' | '稀有' | '精锐' | '超稀有' | '海上传奇' | '最高方案' | '决战方案' | ''

interface ShipData {
  empty?: boolean
  avatar: string
  key: string
  alias: string
  name: string
  data: {
    param0?: unknown
    param1: string
    param2: ShipLevel
    param3: string
    param4: string
  }
}
