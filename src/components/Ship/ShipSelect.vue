<template>
  <Transition name="select">
    <div
      class="select-view"
      v-show="select.show"
    >
      <div class="header">
        <img :src="avatarData.avatar" />
        <div class="name">
          <span v-if="typeof avatarData.key === 'string'">{{ avatarData.key }}</span>
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
            class="player"
          />
          <ShipItem
            v-for="item in usedShipList"
            :key="item.key"
            :highlight="item.key === avatarData.key"
            :item
            @click.stop="change(item)"
          />
          <template v-if="!hasFilter || (hasFilter && showData.custom.length > 0)">
            <div class="label">自定义角色</div>
            <div
              class="item"
              @click.stop="createCustom"
            >
              <Add />
            </div>
            <ShipItem
              v-for="item in showData.custom"
              :key="item.key"
              :highlight="item.key === avatarData.key"
              :item
              @click.stop="change(item)"
              @contextmenu.prevent.stop="delShip(item.key)"
            >
            </ShipItem>
          </template>
          <template v-if="!hasFilter || (hasFilter && showData.game.length > 0)">
            <div class="label">游戏角色</div>
            <ShipItem
              v-for="item in showData.game"
              :key="item.key"
              :highlight="item.key === avatarData.key"
              :item
              @click.stop="change(item)"
            />
          </template>
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
            <Close />
          </div>
        </transition>
        <div
          class="filter"
          @click.stop="onFilterClick"
        >
          <Filter />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { popupManager } from '@/assets/scripts/popup'
import input from '@/store/input'
import { currentJUUs, getMessage } from '@/store/juus'
import { filter, select } from '@/store/select'
import { ship } from '@/store/ship'
import talk from '@/store/talk'
import { computed, ref } from 'vue'
import { Add, Close, Filter } from '../Public/Icon'
import ShipFilter from './ShipFilter.vue'
import ShipItem from './ShipItem.vue'
import { getAvatarBase64 } from '@/assets/scripts/avatar'

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

const hasFilter = computed(
  () =>
    filter.param1.size > 0 ||
    filter.param2.size > 0 ||
    filter.param3.size > 0 ||
    filter.param4.size > 0
)

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
  } else if (hasFilter.value) {
    for (const i in ship.game) {
      if (isFilter(ship.game[i].data)) {
        list.game.push(ship.game[i])
      }
    }

    for (const i in ship.custom) {
      console.log(ship.custom[i].data)
      if (isFilter(ship.custom[i].data)) {
        list.custom.push(ship.custom[i])
      }
    }

    return list
  }

  return ship
})

const change = async (data: ShipData<any>) => {
  avatarData.value.key = data.key
  avatarData.value.name = data.nickname || data.alias || data.name
  if (data.key === '指挥官' || typeof data.key === 'number') {
    avatarData.value.avatar = data.avatar
  } else {
    avatarData.value.avatar = await getAvatarBase64(data.key)
  }
}

const avatarData = computed(() => {
  if (!currentJUUs.value) return input
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
  popupManager
    .open('cropper', {
      aspectRatio: 1,
      maxWidth: 1280
    })
    .then((res) => {
      popupManager
        .open('input', {
          title: '创建角色',
          subTitle: 'ADD CHARACTER',
          tip: '请输入姓名'
        })
        .then((name) => {
          if (name !== null) {
            addCustom(res.base64, name)
          }
        })
    })
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
      param3: '其他',
      param4: '自定义'
    }
  })
}

const delShip = (key: string | number) => {
  popupManager.open('confirm', {
    text: ['真的要删除吗'],
    fn: () => {
      const index = ship.custom.findIndex((item) => item.key === key)
      if (index !== -1) {
        ship.custom.splice(index, 1)
      }
    }
  })
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
  z-index 9
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
        border-radius 5px
        background-color rgba(200, 200, 200, 0.5)

      &::-webkit-scrollbar-thumb
        border-radius 10px
        background-color rgba(180, 180, 180, 0.9)

      &::-webkit-scrollbar-thumb:active
        background-color rgba(150, 150, 150, 0.9)

      .label
        margin 10px 0
        margin-left 10px
        padding-bottom 10px
        width 95%
        border-bottom 1px solid rgba(0, 0, 0, 0.3)
        font-weight bold
        font-size 18px

      .player
        :deep(.avatar)
          border-radius 50%

      .item
        height 70px
        color #8a8a8a
        cursor pointer
        item()

        &:hover
          background rgba(240, 240, 240, 0.5)

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
      border-radius 3px
      color #999
      font-size 16px

    .clear
      position absolute
      top 50%
      right 60px
      display flex
      justify-content center
      align-items center
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

      svg
        width 15px
        height 15px

    .filter
      display flex
      flex-shrink 0
      justify-content center
      align-items center
      box-sizing border-box
      margin-left 5px
      width 35px
      height 35px
      border 2px solid #ddd
      border-radius 5px
      background #fff
      color #ddd
      cursor pointer

      svg
        width 20px

.header
  z-index 10
  flex-shrink 0
  overflow hidden
  width 100%
  height 80px
  item()

  img
    margin 0 15px
    width 45px
    height 45px
    border-radius 50%

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
    box-sizing border-box
    padding 0 5px
    width 100%
    border none
    color #444
    text-overflow ellipsis
    font-weight bolder
    font-size 20px

  .close
    margin-left 10px
    width 30px
    height 30px
    line-height 40px
    cursor pointer
</style>
