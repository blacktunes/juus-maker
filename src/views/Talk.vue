<template>
  <div class="main">
    <div class="mask" @click.stop="stopPlay" v-show="setting.play"></div>
    <div class="talk-wrapper" ref="dom">
      <div class="title">
        <span class="title-text" contenteditable @input="titleChange($event)">
          {{ data.title }}
        </span>
      </div>
      <div class="talk-list" ref="listDom">
        <draggable
          tag="transition-group"
          :component-data="{ name: 'list', type: 'transition' }"
          v-model="data.list"
          :item-key="item => `comment-${data.list.indexOf(item)}`"
        >
          <template #item="{ element, index }">
            <div class="item" :class="{ right: element.key === '指挥官' }">
              <Avatar
                :highlight="select.type === 4 && select.index === index"
                :src="element.avatar"
                v-if="
                  element.key !== '指挥官' &&
                  (index === 0 || element.key !== data.list[index - 1].key)
                "
                @click="avatarClick(4, index)"
              />
              <div v-else-if="element.key !== '指挥官'" class="empty"></div>
              <div
                :style="{
                  marginLeft: element.key === '指挥官' ? '45px' : ''
                }"
              >
                <div
                  class="name"
                  v-if="
                    element.key !== '指挥官' &&
                    (index === 0 || element.key !== data.list[index - 1].key)
                  "
                >
                  <span contenteditable @input="nameChange(index, $event)">
                    {{ element.name }}
                  </span>
                </div>
                <div class="text">
                  <span contenteditable @input="textChange(index, $event)">
                    {{ element.text }}
                  </span>
                  <img class="img" v-if="element.img" :src="element.img" />
                  <div class="del" @click="delComment(index)">×</div>
                </div>
              </div>
            </div>
          </template>
        </draggable>
      </div>
      <div class="add">
        <Avatar :width="40" :src="input.avatar" @click="avatarClick(0)" />
        <input
          class="input"
          v-model="input.text"
          placeholder="Aa"
          @keydown.enter="addComment()"
        />
        <img
          src="@/assets/images/图片.png"
          style="cursor: pointer; width: 34px; margin-right: 2px"
          @click="addImage"
        />
        <img
          src="@/assets/images/message_2.png"
          style="cursor: pointer; width: 29px"
          @click="addComment()"
        />
      </div>
    </div>
    <transition name="slide">
      <div v-if="!setting.play" class="menu-wrapper">
        <ShipSelect class="select" @close="select.type = 0" />
        <div class="menu">
          <div class="icon" @click="screenshot">
            <img src="@/assets/images/save.png" />
          </div>
          <div class="icon" @click="autoPlay">
            <img src="@/assets/images/play.png" />
          </div>
          <div class="sep"></div>
          <a
            class="icon"
            style="
              background: #333;
              border-radius: 50%;
              width: 30px;
              height: 30px;
              margin: 0 3px;
            "
            href="https://github.com/blacktunes/juus-maker"
            target="_blank"
          >
            <img src="@/assets/images/github.png" />
          </a>
          <a
            class="icon"
            href="https://space.bilibili.com/1384118"
            target="_blank"
          >
            <img src="@/assets/images/bilibili.png" />
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import ship from '@/assets/data'
import _screenshot from '@/assets/scripts/screenshot'
import Avatar from '@/components/common/Avatar'
import ShipSelect from '@/components/ShipSelect.vue'
import input, { resetSelectData, select } from '@/store/input'
import { setting } from '@/store/setting'
import data from '@/store/talk'
import { nextTick, ref } from 'vue'
import draggable from 'vuedraggable'

const dom = ref(null)
const listDom = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    listDom.value.scrollTo({
      top: listDom.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const addComment = img => {
  data.list.push({
    ...input,
    img,
    text: img ? input.text : input.text || '谢谢你，碧蓝航线'
  })
  scrollToBottom()
  input.text = ''
}

const delComment = index => {
  resetSelectData()
  data.list.splice(index, 1)
}

const addImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = e => {
        addComment(e.target.result)
      }
    }
  }
  input.click()
}

const titleChange = e => {
  data.title = e.target.innerText
}

const textChange = (index, e) => {
  data.list[index].text = e.target.innerText
}

const nameChange = (index, e) => {
  data.list[index].name = e.target.innerText
}

const avatarClick = (type, index) => {
  select.type = type
  select.index = index
}

const screenshot = () => {
  reset()
  _screenshot(dom.value, dom.value.offsetWidth, listDom.value.scrollHeight + 60 + 50)
}

let tempList = []

const _addComment = i => {
  if (!setting.play) return

  data.list.push(tempList[i])
  nextTick(() => {
    scrollToBottom()

    if (tempList[i + 1]) {
      setTimeout(() => {
        _addComment(i + 1)
      }, setting.interval)
    } else {
      setting.play = false
    }
  })
}

const autoPlay = () => {
  if (setting.play || data.list.length < 1) return

  setting.play = true

  reset()

  tempList = data.list
  data.list = []

  setTimeout(() => {
    _addComment(0)
  }, 100)
}

const stopPlay = () => {
  setting.play = false
  data.list = tempList
  tempList = []
  nextTick(() => {
    listDom.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

const reset = () => {
  select.type = 0
  input.key = '指挥官'
  input.avatar = ship['指挥官'].avatar
  input.name = '指挥官'
}
</script>

<style lang="stylus" scoped>
bottomBar()
  height 40px
  padding 10px 5px
  background rgb(76, 91, 112)

.main
  display flex
  height 100vh
  overflow scroll

  .talk-wrapper
    display flex
    flex-direction column
    max-width 100vw
    min-height 100vh
    background #eff7ff

    .title
      display flex
      justify-content center
      align-items center
      height 50px
      background #4c5b70
      color #ddd
      font-size 16px
      font-weight bold

      .title-text
        max-width 60%
        white-space nowrap
        overflow hidden
        text-overflow ellipsis

    .talk-list
      flex 1
      overflow-x hidden
      padding 15px 0px 15px 15px

      .item
        display flex
        width 100%

        .empty
          width 45px

        .name
          font-weight bold
          margin-left 10px

        .text
          position relative
          padding 10px
          margin 5px 10px
          border-radius 5px
          background rgb(76, 91, 112)
          color #fff
          width fit-content

          &:hover
            .del
              opacity 1

          .del
            position absolute
            right -20px
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

  .menu-wrapper
    position sticky
    top 0
    flex 1
    display flex
    flex-direction column
    height 100vh

    .select
      flex 1
      height 0
      background #f6fbff

    .menu
      display flex
      align-items center
      justify-content center
      bottomBar()

      .sep
        height 100%
        border 1px solid #484848
        margin 0 5px 0 6px

      .icon
        display flex
        width 35px
        height 35px
        cursor pointer

        img
          width 100%

.add
  position sticky
  bottom 0
  display flex
  align-items center
  justify-content space-between
  bottomBar()

  .input
    flex 1
    width 0
    font-size 20px
    color #666
    padding 5px 10px
    margin 0 8px
    height 24px
    border-radius 5px
    border 1px solid #aaa

.right
  flex-direction row-reverse

  .text
    background rgb(74, 138, 202) !important

    .del
      left -20px
      right unset !important
      color #000

.img
  width 100%

@media only screen and (min-width 400px)
  .talk-wrapper
    width 400px
    flex 0 0 400px

@media only screen and (max-width 400px)
  .talk-wrapper
    width 100vw
    flex 0 0 100vw
</style>

<style lang="stylus">
::-webkit-scrollbar
  width 0
  height 0
</style>
