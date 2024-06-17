<template>
  <div
    class="talk-wrapper"
    ref="dom"
  >
    <div class="title">
      <div
        class="back"
        @click="back"
      >
        <svg
          style="height: 25px"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
        >
          <path
            d="M363.840919 472.978737C336.938714 497.358861 337.301807 537.486138 364.730379 561.486138L673.951902 832.05497C682.818816 839.813519 696.296418 838.915012 704.05497 830.048098 711.813519 821.181184 710.915012 807.703582 702.048098 799.94503L392.826577 529.376198C384.59578 522.174253 384.502227 511.835287 392.492414 504.59418L702.325747 223.807723C711.056111 215.895829 711.719614 202.404616 703.807723 193.674252 695.895829 184.943889 682.404617 184.280386 673.674253 192.192278L363.840919 472.978737Z"
            fill="#979797"
          ></path>
        </svg>
      </div>
      <span
        class="title-text"
        contenteditable
        @input="titleChange($event)"
      >
        {{ data.list[data.index].title }}
      </span>
    </div>
    <div
      class="talk-list"
      ref="listDom"
    >
      <draggable
        tag="transition-group"
        :component-data="{ name: 'list', type: 'transition' }"
        v-model="talkList"
        :item-key="(item: ReplyItem) => `comment-${talkList.indexOf(item)}`"
        animation="100"
        delay="100"
        chosen-class="chosen"
      >
        <template #item="{ element, index }">
          <div
            class="item"
            :class="{ right: element.key === '指挥官' }"
            @click="avatarClick(4, index)"
            :style="{
              paddingTop: index === 0 || element.key !== talkList[index - 1].key ? undefined : '0'
            }"
          >
            <Avatar
              v-if="index === 0 || element.key !== talkList[index - 1].key"
              :highlight="select.type === 4 && select.index === index"
              :src="element.avatar"
              @click.stop="avatarClick(4, index, true)"
            />
            <div
              v-else
              class="empty"
              @click.stop="avatarClick(4, index, true)"
            ></div>
            <div style="max-width: 85%">
              <div
                class="name"
                :class="{ 'right-text': element.key === '指挥官' }"
                v-if="index === 0 || element.key !== talkList[index - 1].key"
              >
                <span
                  contenteditable
                  @input="nameChange(index, $event)"
                >
                  {{ element.name }}
                </span>
              </div>
              <div class="text">
                <span
                  contenteditable
                  @input="textChange(index, $event)"
                >
                  {{ element.text }}
                </span>
                <img
                  class="img"
                  v-if="element.img"
                  :src="element.img"
                  @click.stop="imgChange(index)"
                />
                <div
                  class="del"
                  @click.stop="delComment(index)"
                >
                  ×
                </div>
              </div>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="add">
      <Avatar
        :width="40"
        :src="input.avatar"
        @click="avatarClick(0, undefined, true)"
      />
      <input
        class="input"
        v-model="input.text"
        placeholder="Aa"
        @keydown.enter="addComment()"
      />
      <Image
        style="cursor: pointer; width: 34px; margin-right: 2px"
        @click="addImage"
      />
      <SendMessage
        style="cursor: pointer; width: 29px"
        @click="addComment()"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '@/components/Public/Avatar.vue'
import { Image, SendMessage } from '@/components/Public/Icon'
import input from '@/store/input'
import { resetSelectData, select } from '@/store/select'
import { setting } from '@/store/setting'
import data from '@/store/talk'
import draggable from '@marshallswain/vuedraggable'
import { screenshot as _screenshot } from 'star-rail-vue'
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits<{
  (event: 'avatar'): void
}>()

const tempList = ref<ReplyItem[]>([])
const talkList = computed({
  get: () => (setting.play ? tempList.value : data.list[data.index].list),
  set: (val) => {
    if (!setting.play) {
      data.list[data.index].list = val
    }
  }
})

const back = () => {
  reset()
  data.home = true
}

const dom = ref<HTMLElement | null>(null)
const listDom = ref<HTMLElement | null>(null)

const scrollToBottom = () => {
  nextTick(() => {
    listDom.value?.scrollTo({
      top: listDom.value?.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const addComment = (img?: string) => {
  data.list[data.index].list.push({
    ...input,
    img,
    text: img ? input.text : input.text || '谢谢你，碧蓝航线',
    nickname: ''
  })
  scrollToBottom()
  input.text = ''
  timeUpdate()
}

const delComment = (index: number) => {
  resetSelectData()
  data.list[data.index].list.splice(index, 1)
  timeUpdate()
}

const addImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        addComment(e.target?.result as string)
      }
    }
  }
  input.click()
}

const titleChange = (e: Event) => {
  data.list[data.index].title = (e.target as HTMLInputElement).innerText
  timeUpdate()
}

const textChange = (index: number, e: Event) => {
  data.list[data.index].list[index].text = (e.target as HTMLInputElement).innerText
  timeUpdate()
}

const imgChange = (index: number) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        data.list[data.index].list[index].img = e.target?.result as string
        timeUpdate()
      }
    }
  }
  input.click()
}

const nameChange = (index: number, e: Event) => {
  data.list[data.index].list[index].name = (e.target as HTMLInputElement).innerText
  timeUpdate()
}

const avatarClick = (type: number, index = 0, event = false) => {
  select.type = type
  select.index = index
  if (event) emit('avatar')
}

const timeUpdate = () => {
  data.list[data.index].time = Date.now()
}

const screenshot = () => {
  if (dom.value && listDom.value) {
    reset()
    _screenshot(dom.value, {
      width: dom.value.offsetWidth,
      height: listDom.value.scrollHeight + 60 + 50
    })
  }
}

const autoPlay = () => {
  if (setting.play || data.list[data.index].list.length < 1) return

  setting.play = true

  reset()

  tempList.value = []

  setTimeout(() => {
    _addComment(0)
  }, 100)
}

const _addComment = (i: number) => {
  if (!setting.play) return

  tempList.value.push(data.list[data.index].list[i])
  nextTick(() => {
    scrollToBottom()

    if (data.list[data.index].list[i + 1]) {
      setTimeout(() => {
        _addComment(i + 1)
      }, setting.interval)
    } else {
      setting.play = false
    }
  })
}

const stopPlay = () => {
  setting.play = false
  tempList.value = []
  scrollToBottom()
}

const reset = () => {
  select.type = 0
  input.key = '指挥官'
  input.avatar = data.name.avatar
  input.name = data.name.name
}

let timer: number
onMounted(() => {
  timer = setTimeout(scrollToBottom, 320)
})
onBeforeUnmount(() => {
  clearTimeout(timer)
})

defineExpose({ screenshot, autoPlay, stopPlay })
</script>

<style lang="stylus" scoped>
$text-color = #555

.talk-wrapper
  .title
    display flex
    justify-content flex-start
    align-items center
    height 35px
    color $text-color
    font-weight bold
    font-size 16px

    .back
      display flex
      justify-content center
      align-items center
      height 100%
      cursor pointer

    .title-text
      overflow hidden
      max-width 60%
      text-overflow ellipsis
      white-space nowrap

  .talk-list
    flex 1
    overflow-x hidden
    padding 10px 0

    .item
      position relative
      display flex
      box-sizing border-box
      padding 10px 10px 0
      width 100%

      .empty
        width 45px

      .name
        overflow hidden
        margin-left 10px
        text-overflow ellipsis
        white-space nowrap
        font-weight bold

      .text
        position relative
        margin 5px 10px
        padding 10px
        max-width 90%
        width fit-content
        border-radius 0px 10px 10px 10px
        background #fff
        box-shadow 0px 0px 6px rgba(0, 0, 0, 0.12)
        color $text-color

        &:hover
          .del
            opacity 1

        .del
          position absolute
          top 50%
          right -20px
          color #000
          font-size 20px
          line-height 20px
          opacity 0
          cursor pointer
          transition opacity 0.2s
          transform translateY(-50%)
          user-select none

          &:hover
            opacity 1

.add
  position sticky
  bottom 0
  display flex
  justify-content space-between
  align-items center
  box-sizing border-box
  padding 10px 5px
  height 50px
  background #eee

  .input
    flex 1
    box-sizing border-box
    margin 0 5px
    padding 5px 15px
    width 100px
    height 34px
    outline none
    border 2px solid #ddd
    border-radius 17px
    color #666
    font-size 18px

.right
  flex-direction row-reverse

  .text
    border-radius 10px 0px 10px 10px !important
    background #87cefa !important

    .del
      right unset !important
      left -20px
      color #000

.right-text
  margin-right 10px
  margin-left unset !important
  text-align right

.img
  width 100%
  cursor pointer
</style>
