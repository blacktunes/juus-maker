<template>
  <div
    v-if="currentJUUs"
    class="content"
    :class="{ scroll: !screenshot }"
    ref="dom"
  >
    <div class="info-wrapper">
      <div class="tip">·FOLLOWING·</div>
      <div class="info">
        <Avatar
          :highlight="select.show && select.type === 1"
          :src="currentJUUs.juus.avatar"
          :type="2"
          :width="65"
          style="margin-left: 30px"
          @click="avatarClick(1)"
        />
        <img
          src="@/assets/images/sep.png"
          class="sep"
        />
        <div class="name">
          <span>@</span>
          <span
            class="name-text"
            contenteditable
            @keydown.enter.prevent=""
            @input="juusChange('name', $event)"
          >
            {{ currentJUUs.juus.name }}
          </span>
        </div>
        <img
          src="@/assets/images/icon.png"
          style="margin-right: 10px"
        />
      </div>
    </div>
    <div class="text-wrapper">
      <div
        class="text"
        contenteditable
        @keydown.enter.prevent=""
        @input="juusChange('text', $event)"
      >
        {{ currentJUUs.juus.text }}
      </div>
      <div class="line"></div>
    </div>
    <div
      class="comment-list"
      ref="listDom"
    >
      <draggable
        tag="transition-group"
        :component-data="{ name: 'list', type: 'transition' }"
        v-model="juusList"
        :item-key="(item: JUUsComment) => `comment-${juusList.indexOf(item)}`"
        animation="100"
        delay="100"
        chosen-class="chosen"
      >
        <template #item="{ element, index }: { element: JUUsComment; index: number }">
          <div class="comment-card">
            <div class="comment">
              <Avatar
                :highlight="select.show && select.type === 2 && select.index === index"
                :src="element.avatar"
                style="margin: 0 15px 0 10px"
                @click="avatarClick(2, index)"
              />
              <div>
                <span class="name">
                  <span
                    contenteditable
                    @keydown.enter.prevent=""
                    @input="commentChange('name', index, $event)"
                  >
                    {{ element.name }}
                  </span>
                  .
                </span>
                <span
                  class="comment-text"
                  contenteditable
                  @keydown.enter.prevent=""
                  @input="commentChange('text', index, $event)"
                >
                  {{ element.text }}
                </span>
              </div>
            </div>
            <div
              class="comment-del"
              @click="delComment(index)"
            >
              ×
            </div>
            <div class="reply-num-wrapper">
              <div></div>
              <div>reply</div>
              <div class="reply-num">
                <img
                  src="@/assets/images/message_3.png"
                  @click="addReply(index, $event)"
                />
                <div class="text">{{ element.reply.length }}</div>
              </div>
            </div>
            <div class="reply-list">
              <draggable
                v-model="element.reply"
                :item-key="(item: ReplyItem) => 'reply' + element.reply.indexOf(item)"
                animation="100"
                chosen-class="chosen"
                group="reply"
              >
                <template #item="item">
                  <div class="reply">
                    <div
                      class="reply-del"
                      @click="delReply(index, item.index)"
                    >
                      ×
                    </div>
                    <Avatar
                      :highlight="
                        select.show &&
                        select.type === 3 &&
                        select.index === index &&
                        select.key === item.index
                      "
                      :src="item.element.avatar"
                      style="margin: 0 15px 0 10px"
                      @click="avatarClick(3, index, item.index)"
                    />
                    <div class="reply-item">
                      <span class="name"
                        ><span
                          contenteditable
                          @keydown.enter.prevent=""
                          @input="replyChange('name', index, item.index, $event)"
                        >
                          {{ item.element.name }}</span
                        >
                        .
                      </span>
                      <span
                        class="comment-text"
                        contenteditable
                        @keydown.enter.prevent=""
                        @input="replyChange('text', index, item.index, $event)"
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
    <div class="add-comment">
      <div class="left">
        <Avatar
          :highlight="select.show && select.type === 0"
          :src="input.avatar"
          style="margin: 0 15px 0 10px"
          @click="avatarClick(0)"
        />
        <input
          class="input"
          v-model="input.text"
          placeholder="Add a comment..."
          @keydown.enter="addComment"
        />
      </div>
      <div class="right">
        <img
          src="@/assets/images/message_2.png"
          @click="addComment"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Avatar from '@/components/common/Avatar.vue'
import { currentJUUs } from '@/store/data'
import input from '@/store/input'
import { resetSelectData, select } from '@/store/select'
import { setting } from '@/store/setting'
import draggable from '@marshallswain/vuedraggable'
import { computed, nextTick, ref } from 'vue'

defineProps(['screenshot'])

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
    dom.value?.scrollTo({
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
  resetSelectData()
  currentJUUs.value!.comment.splice(index, 1)
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
  currentJUUs.value!.juus[key] = (e.target as HTMLInputElement).innerText
}

const commentChange = (key: 'name' | 'text', index: number, e: Event) => {
  currentJUUs.value!.comment[index][key] = (e.target as HTMLInputElement).innerText
}

const replyChange = (key: 'name' | 'text', comment: number, index: number, e: Event) => {
  currentJUUs.value!.comment[comment].reply[index][key] = (e.target as HTMLInputElement).innerText
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

defineExpose({ dom, autoPlay, stopPlay })
</script>

<style lang="stylus" src="./Content.styl" scoped></style>
