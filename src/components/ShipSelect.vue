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
      <template v-if="customInput.show">
        <div class="item" style="cursor: pointer" @click.stop="createCustom">
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
      </template>
      <transition name="horizontal-list">
        <template v-if="!customInput.show">
          <div class="custom">
            <Avatar :src="customInput.avatar" @click.stop="createCustom" />
            <input
              type="text"
              v-model="customInput.key"
              ref="customRef"
              @keydown.enter="addCustom"
            />
            <div class="custom-btn" @click.stop="cancalCustom">
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
              >
                <path
                  d="M872.96 810.666667a36.977778 36.977778 0 0 1 3.697778 55.182222 40.106667 40.106667 0 0 1-55.466667 3.697778l-3.697778-3.697778-95.857777-95.857778-117.76-118.044444A36.977778 36.977778 0 0 1 600.177778 597.333333a39.822222 39.822222 0 0 1 54.044444-4.266666l3.697778 3.697777 213.902222 213.902223z m0-604.728889l-7.395556 7.395555L209.351111 865.848889a44.942222 44.942222 0 0 1-58.88-3.697778 39.253333 39.253333 0 0 1-3.697778-51.484444l3.697778-3.697778L455.111111 504.604444 165.262222 213.333333a35.555556 35.555556 0 0 1-3.697778-51.484444l3.697778-3.697778a39.253333 39.253333 0 0 1 51.484445-3.697778l3.697777 3.697778L512 449.422222 806.4 154.453333a45.226667 45.226667 0 0 1 59.164444 3.697778c11.093333 14.791111 22.186667 33.28 7.395556 47.786667z"
                  fill="#999999"
                ></path>
              </svg>
            </div>
            <div
              class="custom-btn"
              style="border-radius: 0 10px 10px 0"
              @click.stop="addCustom"
            >
              <svg
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                width="34"
                height="34"
              >
                <path
                  d="M878.933333 282.737778a53.475556 53.475556 0 0 0-69.973333 0L398.222222 641.706667l-162.133333-161.848889a52.906667 52.906667 0 0 0-69.973333 0 52.906667 52.906667 0 0 0 0 69.973333l197.12 197.12a53.191111 53.191111 0 0 0 69.973333 0L878.933333 352.711111a52.906667 52.906667 0 0 0 0-69.973333z"
                  fill="#999999"
                ></path>
              </svg>
            </div>
          </div>
        </template>
      </transition>
      <transition-group name="horizontal-list">
        <div
          class="item"
          :class="{ highlight: player.key === avatarData.key }"
          @click="change(player.key)"
          key="player"
        >
          <Avatar
            :src="player.avatar"
            style="margin-right: 10px; cursor: default"
          />
          <div class="name">{{ player.key }}</div>
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
            style="margin-right: 10px; cursor: default"
          />
          <div class="name">{{ item.key }}</div>
          <div
            class="del-ship"
            @click.stop="delShip(item.key)"
            v-if="item.data.param3 === '自定义'"
          >
            ×
          </div>
        </div>
      </transition-group>
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
import custom from '@/store/custom'
import input, { select } from '@/store/input'
import juus from '@/store/juus'
import talk from '@/store/talk'
import { computed, nextTick, reactive, ref } from 'vue'

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

const player = getData('指挥官')

const showData = computed(() => {
  const temp: ShipData[] = []
  const used: string[] = []
  const list = [...custom.value, ...ship]
  if (searchText.value) {
    for (const i in list) {
      try {
        const reg = new RegExp(searchText.value, 'gi')
        if (reg.test(list[i].key) || reg.test(list[i].name) || reg.test(list[i].alias)) {
          if (temp.findIndex(item => item.key === list[i].key) === -1) {
            temp.push(list[i])
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
        const data = getData(key)
        if (!data.empty) {
          temp.push(getData(key))
        }
      }
    }
    for (const i in list) {
      if (temp.findIndex(item => item.key === list[i].key) === -1) {
        temp.push(list[i])
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

const customRef = ref<HTMLInputElement | null>(null)

const customInput = reactive({
  show: true,
  avatar: '',
  key: ''
})

const createCustom = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = e => {
        customInput.avatar = e.target?.result as string || ''
        customInput.show = false
        nextTick(() => {
          if (customRef.value) {
            customRef.value.focus()
          }
        })
      }
    }
  }
  input.click()
}

const cancalCustom = () => {
  customInput.show = true
}

const delShip = (key: string) => {
  const index = custom.value.findIndex(item => item.key === key)
  if (index !== -1) {
    custom.value.splice(index, 1)
  }
}

const addCustom = () => {
  if (!customInput.key) {
    console.warn('key不能为空')
    return
  }

  if (ship.findIndex(item => item.key === customInput.key) !== -1) {
    console.warn('key已存在')
    return
  }

  const index = custom.value.findIndex(item => item.key === customInput.key)

  if (index === -1) {
    custom.value.unshift({
      avatar: customInput.avatar,
      key: customInput.key,
      alias: '',
      name: '',
      data: {
        param1: '',
        param2: '',
        param3: '自定义',
        param4: ''
      }
    })
  } else {
    custom.value[index].avatar = customInput.avatar
    custom.value[index].key = customInput.key
  }
  customInput.show = true
  customInput.key = ''
  customInput.avatar = ''
}
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
      position relative
      height 70px
      item()

      &:hover
        background rgb(240, 240, 240)

        .del-ship
          opacity 1

      .del-ship
        color #888
        opacity 0
        position absolute
        right 5px
        top 0
        cursor pointer
        user-select none
        transition opacity 0.25s

        &:hover
          opacity 1

    .custom
      height 70px
      item()

      input
        width 130px
        height 40px
        padding 0 5px
        box-sizing border-box
        border-radius 10px 0 0 10px
        margin-left 6px
        font-size 22px

      .custom-btn
        display flex
        justify-content center
        align-items center
        width 40px
        height 40px
        border 2px solid #ddd
        border-left none
        box-sizing border-box
        cursor pointer

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
