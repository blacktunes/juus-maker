<template>
  <div>
    <div class="title">
      <div class="user">
        <div class="avatar" @click="setAvatar($event)">
          <img :src="data.name.avatar" />
        </div>
        <span contenteditable @input="nameChange($event)">
          {{ data.name.name }}
        </span>
      </div>
      <div style="cursor: pointer" @click="addTalk">
        <svg
          style="height: 30px"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
        >
          <path
            d="M512 832a32 32 0 0 0 32-32v-256h256a32 32 0 0 0 0-64h-256V224a32 32 0 0 0-64 0v256H224a32 32 0 0 0 0 64h256v256a32 32 0 0 0 32 32"
            fill="#8a8a8a"
          ></path>
        </svg>
      </div>
    </div>
    <div class="talk-list">
      <div
        class="talk"
        v-for="(item, index) in data.list"
        :key="`talk-${index}`"
        @click="showTalk(index)"
      >
        <div class="talk-avatar">
          <img :src="getAvatar(item)" />
        </div>
        <div class="talk-text">
          <div class="talk-title">{{ item.title }}</div>
          <div class="talk-last">{{ getLastText(item) }}</div>
        </div>
        <div class="del" @click.stop="delTalk(index)">×</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import data, { defaultItem } from '@/store/talk'

const getAvatar = (item: TalkData) => {
  if (item.list.length < 1) {
    return
  }
  return item.list[item.list.length - 1].avatar
}

const getLastText = (item: TalkData) => {
  if (item.list.length < 1) {
    return '无历史消息'
  }
  const img = item.list[item.list.length - 1].img
  return `${item.list[item.list.length - 1].name}: ${img ? '[图片]' : item.list[item.list.length - 1].text}`
}

const nameChange = (e: Event) => {
  data.name.name = (e.target as HTMLInputElement).innerText
}

const setAvatar = (e: Event) => {
  e.stopPropagation()
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = e => {
        data.name.avatar = e.target?.result as string || ''
      }
    }
  }
  input.click()
}

const addTalk = () => {
  data.list.unshift(JSON.parse(JSON.stringify({ ...defaultItem, time: Date.now() })))
  data.index = 0
  data.home = false
}

const delTalk = (index: number) => {
  data.list.splice(index, 1)
}

const showTalk = (index: number) => {
  data.index = index
  data.home = false
}
</script>

<style lang="stylus" scoped>
.title
  display flex
  justify-content space-between
  align-items center
  height 45px
  font-size 16px
  font-weight bold

  .user
    display flex
    align-items center
    height 100%

    .avatar
      height 35px
      width 35px
      margin 0 5px
      overflow hidden
      border-radius 50%
      cursor pointer

      img
        width 100%
        height 100%
        object-fit cover
        object-position center

.talk-list
  overflow auto
  padding 5px

  .talk
    display flex
    align-items center
    height 48px
    margin 5px 5px 10px 5px
    user-select none
    cursor pointer
    position relative

    &:hover
      .del
        opacity 1

    .talk-avatar
      height 48px
      width 48px
      overflow hidden
      border-radius 50%
      background #ddd
      flex-shrink 0

      img
        height 100%

    .talk-text
      margin-left 10px
      width calc(100% - 50px)

      .talk-title
        width 90%
        margin-bottom 2px
        font-size 14px
        overflow hidden
        white-space nowrap
        text-overflow ellipsis

      .talk-last
        width 90%
        font-size 12px
        color #999
        overflow hidden
        white-space nowrap
        text-overflow ellipsis

    .del
      position absolute
      right 2px
      top 50%
      transform translateY(-50%)
      color #000
      font-size 20px
      line-height 20px
      user-select none
      cursor pointer
      opacity 0
      transition opacity 0.2s

      &:hover
        opacity 1
</style>
