<template>
  <Transition name="select">
    <div
      class="select-view"
      v-show="select.show"
    >
      <div class="header">
        <Avatar
          class="avatar"
          :src="avatarData.avatar"
        />
        <div class="name">
          <span>{{ typeof avatarData.key === 'number' ? avatarData.name : avatarData.key }}</span>
          <input v-model="avatarData.name" />
        </div>
        <Close
          v-if="showClose"
          class="close"
          @click="close"
        />
      </div>
      <div class="ship-wrapper">
        <div class="scroll-view">
          <div class="label">已使用角色</div>
          <ShipItem
            :highlight="player.key === avatarData.key"
            :item="player"
            @click.stop="change(player)"
          />
          <ShipItem
            v-for="item in usedShipList"
            :key="item.key"
            :highlight="item.key === avatarData.key"
            :item
            @click.stop="change(item)"
          />
          <div class="label">自定义角色</div>
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
          <ShipItem
            v-for="item in showData.custom"
            :key="item.key"
            :highlight="item.key === avatarData.key"
            :item
            @click.stop="change(item)"
          >
            <div
              class="del"
              @click.stop="delShip(item.key)"
            >
              ×
            </div>
          </ShipItem>
          <div class="label">游戏角色</div>
          <ShipItem
            v-for="item in showData.game"
            :key="item.key"
            :highlight="item.key === avatarData.key"
            :item
            @click.stop="change(item)"
          />
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
  </Transition>
</template>

<script lang="ts" setup>
import input from '@/store/input'
import { currentJUUs, getMessage } from '@/store/juus'
import { filter, select } from '@/store/select'
import { ship } from '@/store/ship'
import talk from '@/store/talk'
import { computed, ref } from 'vue'
import Avatar from '../Public/Avatar2.vue'
import { Close } from '../Public/Icon'
import ShipFilter from './ShipFilter.vue'
import ShipItem from './ShipItem.vue'

withDefaults(
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

const player = getMessage('指挥官')

const usedShipList = computed(() => {
  const used: (string | number)[] = []

  if (currentJUUs.value) {
    used.push(currentJUUs.value!.juus.key)
    currentJUUs.value!.comment.forEach((comment) => {
      if (!used.includes(comment.key) && comment.key !== '指挥官') used.push(comment.key)
      comment.reply.forEach((reply) => {
        if (!used.includes(reply.key) && reply.key !== '指挥官') used.push(reply.key)
      })
    })
  }

  const usedShip: ShipData<any>[] = []
  used.forEach((key) => {
    const gameIndex = ship.game.findIndex((item) => item.key === key)
    if (gameIndex !== -1) {
      usedShip.push(ship.game[gameIndex])
    } else {
      const customIndex = ship.custom.findIndex((item) => item.key === key)
      if (customIndex !== -1) {
        usedShip.push(ship.custom[customIndex])
      }
    }
  })

  return usedShip
})

const isFilter = (data: { param1: string; param2: ShipLevel; param3: string; param4: string }) => {
  const flag = [false, false, false, false]

  for (let i = 0; i < 4; i++) {
    const index = (i + 1) as 1 | 2 | 3 | 4
    if (filter[`param${index}`].size > 0) {
      for (const name of filter[`param${index}`]) {
        if (data[`param${index}`].includes(name)) {
          flag[i] = true
          break
        }
      }
    } else {
      flag[i] = true
    }
  }

  return flag[0] && flag[1] && flag[2] && flag[3]
}

const showData = computed(() => {
  const list: { game: ShipData[]; custom: ShipData<number>[] } = {
    game: [],
    custom: []
  }
  if (searchText.value) {
    for (const i in ship.game) {
      try {
        const reg = new RegExp(searchText.value, 'gi')
        if (
          reg.test(ship.game[i].key) ||
          reg.test(ship.game[i].name) ||
          reg.test(ship.game[i].alias)
        ) {
          list.game.push(ship.game[i])
        }
      } catch {
        break
      }
    }

    for (const i in ship.custom) {
      try {
        const reg = new RegExp(searchText.value, 'gi')
        if (reg.test(ship.custom[i].name) || reg.test(ship.custom[i].alias)) {
          list.custom.push(ship.custom[i])
        }
      } catch {
        break
      }
    }

    return list
  } else if (
    filter.param1.size > 0 ||
    filter.param2.size > 0 ||
    filter.param3.size > 0 ||
    filter.param4.size > 0
  ) {
    for (const i in ship.game) {
      if (isFilter(ship.game[i].data)) {
        list.game.push(ship.game[i])
      }
    }

    for (const key in ship.custom) {
      if (isFilter(ship.custom[key].data)) {
        list.custom[key] = ship.custom[key]
      }
    }

    return list
  }

  return ship
})

const change = (data: ShipData<any>) => {
  avatarData.value.key = data.key
  avatarData.value.avatar = data.avatar
  avatarData.value.name = data.nickname || data.alias || data.name
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

const addCustom = (avatar: string, name: string) => {
  if (name.length < 1) {
    console.warn('key不能为空')
    return
  }
  const time = Date.now()
  ship.custom.push({
    avatar: avatar,
    key: time,
    name: name,
    nickname: name,
    alias: '',
    data: {
      param1: '',
      param2: '',
      param3: '其它',
      param4: '自定义'
    }
  })
}

const delShip = (key: string | number) => {
  const flag = confirm('是否删除该角色')
  if (!flag) return
  const index = ship.custom.findIndex((item) => item.key === key)
  if (index !== -1) {
    ship.custom.splice(index, 1)
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

  .ship-wrapper
    flex 1
    flex-direction column
    width 100%
    height 100px
    item()
    align-items flex-start

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

      .label
        margin 10px 0
        padding-bottom 10px
        width 95%
        border-bottom 1px solid rgba(0, 0, 0, 0.3)
        font-weight bold
        font-size 18px

      .item
        position relative
        height 70px
        item()

        &:hover
          background rgb(240, 240, 240)

        .del
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

.header
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
</style>
