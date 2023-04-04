<template>
  <div class="select-view">
    <div class="scroll-view">
      <div class="fixed">
        <Avatar
          :src="avatarData.avatar"
          style="margin-right: 10px; cursor: default"
        />
        <div class="name">
          <span>{{ avatarData.key }} /</span>
          <input v-model="avatarData.name" />
        </div>
        <div v-if="showClose" class="close" @click="close">×</div>
      </div>
      <div
        v-for="item in showData"
        :key="item.key"
        class="item"
        :class="{ highlight: item.key === avatarData.key }"
        @click="change(item.key)"
      >
        <Avatar
          :src="item.avatar"
          style="margin-right: 10px"        />
        <div class="name">{{ item.key }}</div>
      </div>
    </div>
    <div class="search">
      <input v-model="searchText" placeholder="Search" @keydown.esc="clear" />
      <transition name="fade">
        <div class="clear" @click="clear" v-show="searchText">×</div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ship, { getData } from '@/assets/data'
import Avatar from '@/components/common/Avatar.vue'
import input, { select } from '@/store/input'
import juus from '@/store/juus'
import talk from '@/store/talk'
import { computed, ref } from 'vue'

defineProps({
  showClose: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const searchText = ref('')
const clear = () => {
  searchText.value = ''
}

const showData = computed(() => {
  const temp: ShipData[] = [
    getData('指挥官')
  ]
  const used: string[] = []
  if (searchText.value) {
    for (const i in ship) {
      try {
        const reg = new RegExp(searchText.value, 'gi')
        if (reg.test(ship[i].key) || reg.test(ship[i].name) || reg.test(ship[i].alias)) {
          if (temp.findIndex(item => item.key === ship[i].key) === -1) {
            temp.push(ship[i])
          }
        }
      } catch (e) {
        break
      }
    }
  } else {
    if (!juus.home) {
      used.push(juus.list[juus.index].juus.key)
      juus.list?.[juus.index].comment.forEach(comment => {
        if (!used.includes(comment.key)) used.push(comment.key)
        comment.reply.forEach(reply => {
          if (!used.includes(reply.key)) used.push(reply.key)
        })
      })
    }
    if (!talk.home) {
      talk.list?.[talk.index]?.list.forEach(comment => {
        used.push(comment.key)
      })
    }
    for (const key of used) {
      if (key && key !== '指挥官') {
        temp.push(getData(key))
      }
    }
    for (const i in ship) {
      if (temp.findIndex(item => item.key === ship[i].key) === -1) {
        temp.push(ship[i])
      }
    }
  }
  return temp
})

const change = (name: string) => {
  const data = getData(name)
  avatarData.value.key = name
  avatarData.value.avatar = data.avatar
  avatarData.value.name = data.name || data.alias || data.key
}

const avatarData = computed(() => {
  switch (select.type) {
    case 0:
      return input
    case 1:
      return juus.list[juus.index].juus
    case 2:
      return juus.list[juus.index].comment[select.index]
    case 3:
      return juus.list[juus.index].comment[select.index].reply[select.key]
    case 4:
      return talk.list[talk.index].list[select.index]
    default:
      return input
  }
})

const close = () => {
  select.show = false
  emit('close')
}

// const setAvatar = (key: string, e: Event) => {
//   if (key !== '自定义') return

//   e.stopPropagation()
//   const input = document.createElement('input')
//   input.type = 'file'
//   input.accept = 'image/*'
//   input.onchange = () => {
//     if (input.files?.[0]) {
//       const file = new FileReader()
//       file.readAsDataURL(input.files[0])
//       file.onload = e => {
//         ship.自定义.avatar = e.target?.result as string || ''
//       }
//     }
//   }
//   input.click()
// }
</script>

<style lang="stylus" scoped>
item()
  display flex
  align-items center
  box-sizing border-box
  align-items center
  padding 10px 15px 10px 10px
  margin 5px
  user-select none
  border 1px solid #ddd
  border-radius 5px
  background #fff

  .name
    display flex
    align-items center
    flex 1
    font-size 20px
    font-weight bolder

    span
      flex-shrink 0

.select-view
  z-index 99
  box-sizing border-box
  height 100vh
  display flex
  flex-direction column
  background rgba(255, 255, 255, 0.7)
  padding 20px 10px 0 10px
  border-radius 5px 0 0 5px
  color #444

  .scroll-view
    flex 1
    width 100%
    overflow-y scroll
    display flex
    flex-wrap wrap
    justify-content flex-start
    align-content flex-start

    &::-webkit-scrollbar
      width 5px
      height 5px

    &::-webkit-scrollbar-track
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.4)
      border-radius 4px

    &::-webkit-scrollbar-thumb
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
      border-radius 4px

    &::-webkit-scrollbar-thumb:active
      background-color #aaa

    .item
      height 70px
      item()

      &:hover
        background rgb(240, 240, 240)

  .search
    position relative
    height 40px
    padding 10px
    margin-top 10px
    border-top 1px solid #aaa

    input
      box-sizing border-box
      width 100%
      height 40px
      padding 5px 45px 5px 20px
      border-radius 5px
      border 2px solid #aaa
      outline none
      font-size 20px
      color #444

    div
      position absolute
      top 50%
      right 20px
      border 2px solid #aaa
      border-radius 50%
      outline none
      width 20px
      height 20px
      line-height 20px
      text-align center
      user-select none
      cursor pointer
      transform translateY(-50%)
      color #444

.fixed
  z-index 9
  position sticky
  top 0
  margin-top 0 !important
  width 100%
  height 80px
  item()

  input
    font-size 20px
    font-weight bolder
    padding 5px 10px
    border none
    width 240px
    color #444
    overflow hidden
    text-overflow ellipsis

  .close
    font-size 40px
    line-height 40px
    margin-bottom 3px
    cursor pointer

.highlight
  background #87cefa !important

  .name
    color #fff !important
</style>
