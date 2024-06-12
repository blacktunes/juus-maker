<template>
  <div class="select-view">
    <div class="fixed">
      <Avatar
        class="avatar"
        :src="avatarData.avatar"
      />
      <div class="name">
        <span>{{ avatarData.key }}</span>
        <input v-model="avatarData.name" />
      </div>
      <div
        v-if="showClose"
        class="close"
        @click="close"
      >
        ×
      </div>
    </div>
    <div class="scroll-box">
      <div class="scroll-view">
        <div
          class="item"
          style="cursor: pointer"
          @click.stop="createCustom"
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
        <div
          class="item"
          :class="{ highlight: player.key === avatarData.key }"
          @click="change(player.key)"
          key="player"
        >
          <Avatar :src="defaultUser?.avatar || player.avatar" />
          <div>
            <div class="name">{{ defaultUser?.name || player.key }}</div>
            <div class="alias">你</div>
          </div>
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
            :level="item.data.param2"
          />
          <div>
            <div class="name">{{ item.key }}</div>
            <div class="alias">{{ item.name || item.alias || item.key }}</div>
          </div>
          <div
            class="del-ship"
            @click.stop="delShip(item.key)"
            v-if="item.data.param4 === '自定义'"
          >
            ×
          </div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <ShipFilter v-show="filter.show" />
    </transition>
    <div class="search">
      <input
        v-model="searchText"
        placeholder="请输入舰娘名/昵称"
        @keydown.esc="clear"
      />
      <transition name="fade">
        <div
          class="clear"
          @click="clear"
          v-show="searchText"
        >
          ×
        </div>
      </transition>
      <div
        class="filter"
        @click="onFilterClick"
      >
        <svg
          viewBox="0 0 1025 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
        >
          <path
            d="M1024 0H0v1024h1024V0z"
            fill="#bbb"
            fill-opacity=".01"
          ></path>
          <path
            d="M85.12 106.88a42.24 42.24 0 0 0-42.24 42.24 42.88 42.88 0 0 0 42.24 42.88V106.88zM938.88 192a42.24 42.24 0 0 0 42.24-42.88 41.6 41.6 0 0 0-42.24-42.24V192zM85.12 192h853.76V106.88H85.12V192zM85.12 448a42.88 42.88 0 0 0-42.24 42.88 42.24 42.24 0 0 0 42.24 42.24V448zM320 533.12a42.24 42.24 0 0 0 42.88-42.24A42.88 42.88 0 0 0 320 448v85.12z m-234.88 0H320V448H85.12v85.12zM85.12 789.12a42.88 42.88 0 0 0 0 85.76v-85.76zM320 874.88a42.88 42.88 0 0 0 0-85.76v85.76z m-234.88 0H320v-85.76H85.12v85.76zM672 320A224 224 0 1 0 896 544 224 224 0 0 0 672 320z m0 362.88a138.88 138.88 0 1 1 138.88-138.88 138.88 138.88 0 0 1-138.88 138.88z"
            fill="#bbb"
          ></path>
          <path
            d="M819.84 652.8a42.88 42.88 0 1 0-64 60.16l64-60.16z m88.32 210.56a43.52 43.52 0 0 0 64 0 42.24 42.24 0 0 0 0-60.16l-64 60.16z m-149.12-150.4l149.12 150.4 64-60.16-152.32-150.4-64 60.16z"
            fill="#bbb"
          ></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import ship, { getData } from '@/assets/data'
import custom from '@/store/custom'
import { currentJUUs } from '@/store/data'
import input from '@/store/input'
import { filter, select } from '@/store/select'
import talk from '@/store/talk'
import { computed, ref } from 'vue'
import Avatar from '../Public/Avatar2.vue'
import ShipFilter from './ShipFilter.vue'

const props = withDefaults(
  defineProps<{
    showClose?: boolean
    defaultUser?: {
      name: string
      avatar: string
    }
  }>(),
  {
    showClose: true
  }
)

const emit = defineEmits(['close'])

const searchText = ref('')
const clear = () => {
  searchText.value = ''
}

const player = getData('指挥官')

const showData = computed(() => {
  const temp: ShipData[] = []
  let list = [...custom.value, ...ship]

  if (
    filter.param1.size > 0 ||
    filter.param2.size > 0 ||
    filter.param3.size > 0 ||
    filter.param4.size > 0
  ) {
    list = list.filter((item) => {
      const flag = [false, false, false, false]

      for (let i = 0; i < 4; i++) {
        const index = i + 1
        if (filter[`param${index as 1 | 2 | 3 | 4}`].size > 0) {
          for (const name of filter[`param${index as 1 | 2 | 3 | 4}`]) {
            if (item.data[`param${index as 1 | 2 | 3 | 4}`].includes(name)) {
              flag[i] = true
              break
            }
          }
        } else {
          flag[i] = true
        }
      }

      return flag[0] && flag[1] && flag[2] && flag[3]
    })
  }

  if (searchText.value) {
    for (const i in list) {
      try {
        const reg = new RegExp(searchText.value, 'gi')
        if (reg.test(list[i].key) || reg.test(list[i].name) || reg.test(list[i].alias)) {
          temp.push(list[i])
        }
      } catch (e) {
        break
      }
    }
  } else {
    const used: string[] = []

    if (currentJUUs.value) {
      used.push(currentJUUs.value!.juus.key)
      currentJUUs.value!.comment.forEach((comment) => {
        if (!used.includes(comment.key)) used.push(comment.key)
        comment.reply.forEach((reply) => {
          if (!used.includes(reply.key)) used.push(reply.key)
        })
      })
    }
    if (!talk.home) {
      talk.list?.[talk.index]?.list.forEach((comment) => {
        if (!used.includes(comment.key)) used.push(comment.key)
      })
    }
    for (const key of used) {
      if (key && key !== '指挥官') {
        const data = getData(key)
        if (!data.empty) {
          temp.push(getData(key))
        }
      }
    }
    for (const i in list) {
      if (temp.findIndex((item) => item.key === list[i].key) === -1) {
        temp.push(list[i])
      }
    }
  }

  return temp
})

const change = (name: string) => {
  const data = getData(name, undefined, props.defaultUser)
  avatarData.value.key = name
  avatarData.value.avatar = data.avatar
  avatarData.value.name = data.name || data.alias || data.key
}

const avatarData = computed(() => {
  switch (select.type) {
    case 0:
      return input
    case 1:
      return currentJUUs.value!.juus
    case 2:
      return currentJUUs.value!.comment[select.index]
    case 3:
      return currentJUUs.value!.comment[select.index].reply[select.key]
    case 4:
      return talk.list[talk.index].list[select.index]
    default:
      return input
  }
})

const close = () => {
  select.show = false
  filter.show = false
  emit('close')
}

const createCustom = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        const avatar = (e.target?.result as string) || ''
        const key = prompt('请输入角色昵称') || ''
        addCustom(avatar, key)
      }
    }
  }
  input.click()
}

const addCustom = (avatar: string, key: string) => {
  if (key.length < 1) {
    console.warn('key不能为空')
    return
  }

  const index = custom.value.findIndex((item) => item.key === key)

  if (index === -1) {
    custom.value.unshift({
      avatar: avatar,
      key: key,
      alias: '',
      name: '',
      data: {
        param1: '',
        param2: '',
        param3: '其它',
        param4: '自定义'
      }
    })
  } else {
    const flag = confirm('该角色已存在，是否覆盖？')
    if (!flag) return

    custom.value[index].avatar = avatar
    custom.value[index].key = key
  }
}

const delShip = (key: string) => {
  const flag = confirm('是否删除该角色')
  if (!flag) return
  const index = custom.value.findIndex((item) => item.key === key)
  if (index !== -1) {
    custom.value.splice(index, 1)
  }
}

const onFilterClick = () => {
  filter.show = !filter.show
}
</script>

<style lang="stylus" scoped>
item()
  display flex
  align-items center
  align-items center
  box-sizing border-box
  margin 5px
  padding 10px
  border 1px solid #ddd
  border-radius 10px
  background #fff
  user-select none

  .name
    display flex
    flex 1
    align-items center
    font-weight bolder
    font-size 20px

    span
      flex-shrink 0

.select-view
  position relative
  z-index 99
  display flex
  flex-direction column
  box-sizing border-box
  padding 10px 20px 5px 10px
  border-radius 5px 0 0 5px
  background rgba(255, 255, 255, 0.7)
  color #444

  .scroll-box
    flex 1
    width 100%
    height 100px
    item()

    .scroll-view
      display flex
      flex-wrap wrap
      justify-content flex-start
      align-content flex-start
      overflow-y scroll
      width 100%
      height 100%

      &::-webkit-scrollbar
        width 5px
        height 5px

      &::-webkit-scrollbar-track
        border-radius 4px
        box-shadow inset 0 0 6px rgba(0, 0, 0, 0.4)

      &::-webkit-scrollbar-thumb
        border-radius 4px
        box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)

      &::-webkit-scrollbar-thumb:active
        background-color #aaa

      .item
        position relative
        height 70px
        item()

        &:hover
          background rgb(240, 240, 240)

          .del-ship
            opacity 1

        .alias
          font-size 14px

        .del-ship
          position absolute
          top 0
          right 0
          display flex
          justify-content center
          align-items center
          width 15px
          height 15px
          color #888
          opacity 0
          cursor pointer
          transition opacity 0.25s
          user-select none

          &:hover
            opacity 1

  .search
    position relative
    display flex
    width 100%
    height 50px
    item()

    input
      box-sizing border-box
      padding 5px 35px 5px 20px
      width 100%
      height 35px
      outline none
      border 2px solid #ddd
      border-radius 17.5px
      color #999
      font-size 16px

    .clear
      position absolute
      top 50%
      right 60px
      width 20px
      height 20px
      outline none
      border 2px solid #ddd
      border-radius 50%
      color #bbb
      text-align center
      line-height 20px
      cursor pointer
      transform translateY(-50%)
      user-select none

    .filter
      display flex
      justify-content center
      align-items center
      box-sizing border-box
      margin-left 5px
      width 40px
      height 35px
      border 2px solid #bbb
      border-radius 5px
      background #fff
      cursor pointer

.fixed
  z-index 100
  flex-shrink 0
  overflow hidden
  width 100%
  height 80px
  item()

  .avatar
    margin-left 15px

  .name
    display flex
    flex-direction column
    align-items flex-start

    span
      margin-left 5px
      color #999
      font-size 14px

  input
    overflow hidden
    padding 0 5px
    width 90%
    border none
    color #444
    text-overflow ellipsis
    font-weight bolder
    font-size 20px

  .close
    margin-bottom 3px
    font-size 40px
    line-height 40px
    cursor pointer

.highlight
  background #87cefa !important

  .name
  .alias
    color #fff !important
    text-shadow 1px 1px 3px rgba(0, 0, 0, 0.5)
</style>
