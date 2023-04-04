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
  img: string
  bg: string
  like: {
    flag: boolean
    text: string
  }
  time: string
  juus: ReplyItem
  comment: JUUsComment[]
}

interface TalkData {
  title: string
  time: number
  list: ReplyItem[]
}

interface ShipData {
  empty?: boolean
  avatar: string
  key: string
  alias: string
  name: string
  data: {
    param0?: unknown
    param1: string
    param2: string
    param3: string
    param4: string
  }
}
