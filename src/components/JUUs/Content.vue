<template>
  <div
    v-if="currentJUUs"
    class="content"
    :class="{ hidden: setting.screenshot }"
    ref="dom"
  >
    <div class="info-wrapper">
      <div class="tip">·FOLLOWING·</div>
      <div class="info">
        <InfoAvatar
          :highlight="select.show && select.type === 1"
          :img="currentJUUs.juus.avatar"
          :width="70"
          style="margin-left: 30px"
          @click="avatarClick(1)"
        />
        <div class="sep"></div>
        <div class="name">
          <span>@</span>
          <span
            class="name-text"
            contenteditable
            v-blur
            @blur="juusChange('name', $event)"
          >
            {{ currentJUUs.juus.name }}
          </span>
        </div>
        <Follow />
      </div>
    </div>
    <div class="text-wrapper">
      <div
        class="text"
        :class="{ hidden: setting.screenshot }"
        contenteditable
        v-blur
        @blur="juusChange('text', $event)"
      >
        {{ currentJUUs.juus.text }}
      </div>
      <div class="line"></div>
    </div>
    <div
      class="comment-list"
      :class="{ hidden: setting.screenshot }"
      ref="listDom"
    >
      <draggable
        v-model="juusList"
        :item-key="(item: JUUsComment) => `comment-${juusList.indexOf(item)}`"
        :component-data="{ name: 'list', type: 'transition-group' }"
        tag="transition-group"
        animation="100"
        delay="100"
        chosen-class="chosen"
        scroll-sensitivity="50"
        scroll-speed="30"
      >
        <template #item="{ element, index }: { element: JUUsComment; index: number }">
          <div class="comment-card">
            <div class="comment">
              <Avatar
                :highlight="select.show && select.type === 2 && select.index === index"
                :img="element.avatar"
                :type="2"
                style="margin: 0 15px 0 10px"
                @click="avatarClick(2, index)"
              />
              <div>
                <span class="name">
                  <span
                    contenteditable
                    v-blur
                    @blur="commentChange('name', index, $event)"
                  >
                    {{ element.name }}
                  </span>
                  .
                </span>
                <span
                  class="comment-text"
                  contenteditable
                  v-blur
                  @blur="commentChange('text', index, $event)"
                >
                  {{ element.text }}
                </span>
              </div>
            </div>
            <div class="comment-menu">
              <div
                class="del"
                @click="delComment(index)"
              >
                delete
              </div>
              <div>reply</div>
              <div class="reply-num">
                <Message @click="addReply(index, $event)" />
                <div class="text">{{ element.reply.length }}</div>
              </div>
            </div>
            <div class="reply-list">
              <draggable
                v-model="element.reply"
                :item-key="(item: ReplyItem) => 'reply' + element.reply.indexOf(item)"
                :component-data="{ name: 'list', type: 'transition-group' }"
                tag="transition-group"
                animation="100"
                delay="100"
                chosen-class="chosen"
                scroll-sensitivity="50"
                scroll-speed="30"
              >
                <template #item="item">
                  <div class="reply">
                    <Close
                      class="del"
                      @click="delReply(index, item.index)"
                    />
                    <Avatar
                      :highlight="
                        select.show &&
                        select.type === 3 &&
                        select.index === index &&
                        select.key === item.index
                      "
                      :img="item.element.avatar"
                      style="margin: 0 15px 0 10px"
                      @click="avatarClick(3, index, item.index)"
                    />
                    <div class="reply-item">
                      <span class="name"
                        ><span
                          contenteditable
                          v-blur
                          @blur="replyChange('name', index, item.index, $event)"
                        >
                          {{ item.element.name }}</span
                        >
                        .
                      </span>
                      <span
                        class="comment-text"
                        contenteditable
                        v-blur
                        @blur="replyChange('text', index, item.index, $event)"
                      >
                        {{ item.element.text }}
                      </span>
                    </div>
                  </div>
                </template>
              </draggable>
            </div>
          </div>
        </template>
      </draggable>
    </div>
    <div class="menu">
      <Avatar
        :highlight="select.show && select.type === 0"
        :img="input.avatar"
        style="margin-left: 10px"
        @click="avatarClick(0)"
      />
      <input
        v-model="input.text"
        ref="inputDom"
        placeholder="Add a comment..."
        @keydown.enter="addComment"
      />
      <SendMessage @click.stop="addComment" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import { screenshot } from '@/assets/scripts/screenshot'
import Avatar from '@/components/Public/Avatar.vue'
import InfoAvatar from '@/components/Public/InfoAvatar.vue'
import { currentJUUs } from '@/store/juus'
import input from '@/store/input'
import { resetSelectData, select } from '@/store/select'
import { setting } from '@/store/setting'
import draggable from '@marshallswain/vuedraggable'
import { computed, nextTick, ref } from 'vue'
import { Close, Follow, Message, SendMessage } from '../Public/Icon'
import { popupManager } from '@/assets/scripts/popup'

const tempList = ref<JUUsComment[]>([])
const juusList = computed({
  get: () => (setting.play ? tempList.value : currentJUUs.value!.comment),
  set: (val) => {
    if (!setting.play) {
      currentJUUs.value!.comment = val
    }
  }
})

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

const addComment = () => {
  currentJUUs.value!.comment.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线',
    reply: []
  })
  scrollToBottom()
  input.text = ''
}

const delComment = (index: number) => {
  if (!currentJUUs.value) return
  if (currentJUUs.value.comment[index].reply.length > 0) {
    popupManager.open('confirm', {
      text: ['真的要删除吗'],
      fn: () => {
        resetSelectData()
        currentJUUs.value!.comment.splice(index, 1)
      }
    })
  } else {
    resetSelectData()
    currentJUUs.value.comment.splice(index, 1)
  }
}

const addReply = (index: number, e: Event) => {
  currentJUUs.value!.comment?.[index].reply.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线'
  })
  nextTick(() => {
    const temp = (e.target as HTMLElement)?.parentElement?.parentElement?.parentElement
      ?.nextElementSibling
    if (temp && listDom.value && dom.value) {
      const top = temp ? (temp as HTMLElement).offsetTop - 640 + 24 : listDom.value.scrollHeight
      dom.value.scrollTo({ top, behavior: 'smooth' })
    }
  })
  input.text = ''
}

const delReply = (index: number, key: number) => {
  resetSelectData()
  currentJUUs.value!.comment?.[index].reply.splice(key, 1)
}

const juusChange = (key: 'name' | 'text', e: Event) => {
  if (!currentJUUs.value) return
  const el = e.target as HTMLInputElement
  const newText = el.innerText
  if (newText) {
    if (newText !== currentJUUs.value.juus[key]) {
      currentJUUs.value.juus[key] = newText
    }
  } else {
    el.innerText = currentJUUs.value.juus[key]
  }
}

const commentChange = (key: 'name' | 'text', index: number, e: Event) => {
  if (!currentJUUs.value) return
  const el = e.target as HTMLInputElement
  const newText = el.innerText
  if (newText) {
    if (newText !== currentJUUs.value.comment[index][key]) {
      currentJUUs.value.comment[index][key] = newText
    }
  } else {
    el.innerText = currentJUUs.value.comment[index][key]
  }
}

const replyChange = (key: 'name' | 'text', comment: number, index: number, e: Event) => {
  if (!currentJUUs.value) return
  const el = e.target as HTMLInputElement
  const newText = el.innerText
  if (newText) {
    if (newText !== currentJUUs.value!.comment[comment].reply[index][key]) {
      currentJUUs.value!.comment[comment].reply[index][key] = newText
    }
  } else {
    el.innerText = currentJUUs.value!.comment[comment].reply[index][key]
  }
}

interface AvatarClick {
  (type: 0 | 1): void
  (type: 2, index: number): void
  (type: 3, index: number, key: number): void
}

const avatarClick = ((type: 0 | 1 | 2 | 3, index = 0, key = 0) => {
  if (select.show) {
    if (select.type === type) {
      select.show = false
      return
    } else {
      select.type = type
    }
  } else {
    select.type = type
    select.show = true
  }
  select.index = index as number
  select.key = key as number
}) as AvatarClick

const autoPlay = () => {
  if (setting.play || currentJUUs.value!.comment.length < 1) return

  setting.play = true

  tempList.value = []

  setTimeout(() => {
    _addComment(0)
  }, 100)
}

const _addComment = (i: number) => {
  if (!setting.play) return

  tempList.value.push({
    ...currentJUUs.value!.comment[i],
    reply: []
  })

  nextTick(() => {
    scrollToBottom()

    if (currentJUUs.value!.comment[i].reply.length > 0) {
      setTimeout(() => {
        _addReply(i, 0)
      }, setting.interval)
    } else {
      if (currentJUUs.value!.comment[i + 1]) {
        setTimeout(() => {
          _addComment(i + 1)
        }, setting.interval)
      } else {
        setting.play = false
      }
    }
  })
}

const _addReply = (i: number, j: number) => {
  if (!setting.play) return

  tempList.value[i].reply.push(currentJUUs.value!.comment[i].reply[j])
  nextTick(() => {
    scrollToBottom()

    if (currentJUUs.value!.comment[i].reply[j + 1]) {
      setTimeout(() => {
        _addReply(i, j + 1)
      }, setting.interval)
    } else {
      if (currentJUUs.value!.comment[i + 1]) {
        setTimeout(() => {
          _addComment(i + 1)
        }, setting.interval)
      } else {
        setting.play = false
      }
    }
  })
}

const stopPlay = () => {
  setting.play = false
  tempList.value = []
  nextTick(() => {
    dom.value?.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

emitter.on('play', autoPlay)
emitter.on('stop', stopPlay)
emitter.on('screenshot', () => {
  saveJUUs()
})

const saveJUUs = () => {
  if (dom.value) {
    let commentHeight = 0
    if (listDom.value) {
      commentHeight = listDom.value.scrollHeight - listDom.value.offsetHeight
    }
    screenshot(dom.value, { height: dom.value.scrollHeight + commentHeight })
  }
}

const inputDom = ref<HTMLInputElement | null>(null)

const inputFource = () => {
  if (inputDom.value) {
    inputDom.value.focus()
  }
}

defineExpose({ saveJUUs, inputFource })
</script>

<style lang="stylus" scoped>
.content
  display flex
  flex 1
  flex-direction column
  overflow-x hidden
  overflow-y auto
  width 400px
  border-radius 0 10px 10px 0
  background #eff7ff
  box-shadow -1px 0 5px rgba(0, 0, 0, 0.5)

  .info-wrapper
    z-index 2
    width 100%
    border-radius 0 0 25px 25px
    background #fff
    box-shadow 0 3px 20px 0px rgba(0, 0, 0, 0.5)

    .tip
      position absolute
      top 5px
      right 5px
      color #85a7ff
      user-select none

    .info
      display flex
      align-items center
      height 120px

      .sep
        margin 0 10px 0 15px
        width 5px
        height 5px
        border-radius 50%
        background #000

      .name
        display flex
        margin-right 5px
        max-width 200px
        font-weight bold
        font-size 20px

        .name-text
          overflow hidden
          text-overflow ellipsis
          white-space nowrap

      svg
        margin-top 2px

  .text-wrapper
    z-index 1
    padding-bottom 15px
    background #eff7ff

    .text
      overflow auto
      box-sizing border-box
      margin 10px 0
      padding 20px 25px
      max-height 200px
      font-size 18px
      line-height 25px

    .line
      flex-shrink 0
      box-sizing border-box
      margin-left 25px
      width 100%
      height 1px
      background rgba(0, 0, 0, 0.8)
      transform scaleY(0.2)

  .comment-list
    flex 1
    overflow auto
    background #eff7ff
    color #a1a1a2

    .comment-card
      position relative
      display flex
      flex-direction column
      box-sizing border-box
      margin 20px 5px 20px 15px
      padding 15px 0 5px 15px
      width 380px
      border-radius 6px
      background #fff

      &:first-child
        margin-top 0

      &:last-child
        margin-bottom 0

      &:hover
        .comment-menu
          .del
            opacity 1

      .comment
        display flex
        flex 1
        margin-right 15px

        .name
          color #000
          font-weight bold

      .comment-menu
        position relative
        display flex
        justify-content space-between
        align-items center
        margin 10px 0 5px
        padding-left 10px
        height 30px
        font-size 14px
        user-select none

        .del
          opacity 0
          cursor pointer
          transition opacity 0.25s
          user-select none

          &:hover
            opacity 1

        .reply-num
          display flex
          align-items center
          margin-right 10px
          width 45px

          svg
            flex-shrink 0
            width 20px
            height 20px
            cursor pointer

          .text
            overflow hidden
            margin-left 5px
            text-overflow ellipsis

      .reply-list
        display flex
        flex-direction column

        .reply
          position relative
          display flex
          margin-right 10px
          padding 15px 0px 15px 55px

          &:first-child
            margin-top -5px

          &:last-child
            margin-top -5px

          &:hover
            .del
              opacity 1

          .del
            position absolute
            top 23px
            right 0px
            width 18px
            height 18px
            opacity 0
            cursor pointer
            transition opacity 0.25s
            user-select none

            &:hover
              opacity 1

          .reply-item
            flex 1
            margin 8px 15px 0 0
            width 230px
            line-height 20px

            .name
              color #000
              font-weight bold

  .menu
    display flex
    justify-content space-between
    align-items center
    overflow hidden
    box-sizing border-box
    margin-top 10px
    width 100%
    height 60px
    border-top 1px solid rgba(0, 0, 0, 0.2)
    background #fff

    input
      flex 1
      margin 0 10px
      padding 5px 10px
      width 240px
      height 26px
      border none
      color #666
      font-size 20px

    svg
      display flex
      justify-content center
      align-items center
      margin-right 10px
      width 40px
      color #cecece
      cursor pointer
      user-select none

.comment-text
  white-space break-spaces
  word-break break-all

.list-enter-active
  transition all 0.2s

.list-enter-from
  transform scaleY(0)

.list-enter-to
  transform scaleY(1)
</style>
