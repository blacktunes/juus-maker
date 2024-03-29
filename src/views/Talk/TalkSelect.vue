<template>
  <div style="flex: 1">
    <div class="title">
      <div class="user">
        <div
          class="avatar"
          @click="setAvatar($event)"
        >
          <img :src="data.name.avatar" />
        </div>
        <span
          contenteditable
          @input="nameChange($event)"
        >
          {{ data.name.name }}
        </span>
      </div>
      <div
        style="cursor: pointer"
        @click="addTalk"
      >
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
    <div class="sep"></div>
    <div class="talk-list">
      <div
        class="talk"
        v-for="(item, index) in list"
        :key="`talk-${index}`"
        @click="showTalk(index)"
      >
        <template
          v-for="(avatarList, key) in [getAvatar(item)]"
          :key="key"
        >
          <div
            v-if="avatarList.size === 2"
            class="talk-avatar"
          >
            <img :src="[...avatarList.values()][1]" />
          </div>
          <div
            v-else
            class="talk-avatar"
            :class="{
              gird: avatarList.size > 2
            }"
          >
            <img
              v-for="avatar in avatarList"
              :src="avatar"
              :key="`${index}-${avatar}`"
            />
          </div>
        </template>
        <div class="talk-text">
          <div class="talk-title">{{ item.title }}</div>
          <div class="talk-last">{{ getLastText(item) }}</div>
        </div>
        <div
          class="del"
          @click.stop="delTalk(item.time)"
        >
          ×
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import input from '@/store/input'
import data, { defaultItem } from '@/store/talk'
import { computed } from 'vue'

const getAvatar = (item: TalkData) => {
  const avatarList: Set<string> = new Set()
  if (item.list.length < 1) {
    return avatarList
  }
  avatarList.add(data.name.avatar)
  for (const _item of item.list) {
    avatarList.add(_item.avatar)
    if (avatarList.size === 4) break
  }
  return avatarList
}

const list = computed(() => {
  const temp: TalkData[] = JSON.parse(JSON.stringify(data.list))
  temp.sort((a, b) => b.time - a.time)
  return temp
})

const getLastText = (item: TalkData) => {
  if (item.list.length < 1) {
    return '无历史消息'
  }
  const img = item.list[item.list.length - 1].img
  return `${item.list[item.list.length - 1].name}: ${
    img ? '[图片]' : item.list[item.list.length - 1].text
  }`
}

const nameChange = (e: Event) => {
  const name = (e.target as HTMLInputElement).innerText
  data.name.name = name
  if (input.key === '指挥官') {
    input.name = name
  }
}

const setAvatar = (e: Event) => {
  e.stopPropagation()
  const el = document.createElement('input')
  el.type = 'file'
  el.accept = 'image/*'
  el.onchange = () => {
    if (el.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(el.files[0])
      file.onload = (e) => {
        const avatar = (e.target?.result as string) || ''
        data.name.avatar = avatar
        if (input.key === '指挥官') {
          input.avatar = avatar
        }
      }
    }
  }
  el.click()
}

const addTalk = () => {
  data.list.unshift(JSON.parse(JSON.stringify({ ...defaultItem, time: Date.now() })))
  data.index = 0
  data.home = false
}

const delTalk = (time: number) => {
  const index = data.list.findIndex((item) => item.time === time)
  if (index !== -1) {
    data.list.splice(index, 1)
  }
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

.sep
  align-self center
  width 90%
  margin-top 5px
  border-top 1px solid rgba(0, 0, 0, 0.1)

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
      top 0
      right 5px
      color #000
      font-size 20px
      line-height 20px
      user-select none
      cursor pointer
      opacity 0
      transition opacity 0.2s

      &:hover
        opacity 1

.gird
  display grid
  grid-template-columns repeat(auto-fill, 50%)
  justify-items stretch
</style>
