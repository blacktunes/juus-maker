<template>
  <div class="content" :class="{ scroll: !screenshot }" ref="dom">
    <div class="info-wrapper">
      <div class="tip">·FOLLOWING·</div>
      <div class="info">
        <Avatar
          :highlight="select.show && select.type === 1"
          :src="data.list[data.index].juus.avatar"
          :type="2"
          :width="65"
          style="margin-left: 30px"
          @click="avatarClick(1)"
        />
        <img src="@/assets/images/sep.png" class="sep" />
        <div class="name">
          @<span
            contenteditable
            @keydown.enter.prevent=""
            @input="juusChange('name', $event)"
          >
            {{ data.list[data.index].juus.name }}
          </span>
        </div>
        <img src="@/assets/images/icon.png" style="margin-right: 10px" />
      </div>
    </div>
    <div class="text-wrapper">
      <div
        class="text"
        contenteditable
        @keydown.enter.prevent=""
        @input="juusChange('text', $event)"
      >
        {{ data.list[data.index].juus.text }}
      </div>
      <div class="line"></div>
    </div>
    <div class="comment-list" ref="commentList">
      <draggable
        tag="transition-group"
        :component-data="{ name: 'list', type: 'transition' }"
        v-model="data.list[data.index].comment"
        :item-key="
          item => `comment-${data.list[data.index].comment.indexOf(item)}`
        "
      >
        <template #item="{ element, index }">
          <div class="comment-card">
            <div class="comment">
              <Avatar
                :highlight="
                  select.show && select.type === 2 && select.index === index
                "
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
                  contenteditable
                  @keydown.enter.prevent=""
                  @input="commentChange('text', index, $event)"
                >
                  {{ element.text }}
                </span>
              </div>
            </div>
            <div class="comment-del" @click="delComment(index)">×</div>
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
                :item-key="item => 'reply' + element.reply.indexOf(item)"
              >
                <template #item="item">
                  <div class="reply">
                    <div class="reply-del" @click="delReply(index, item.index)">
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
                    <div style="flex: 1">
                      <span class="name"
                        ><span
                          contenteditable
                          @keydown.enter.prevent=""
                          @input="
                            replyChange('name', index, item.index, $event)
                          "
                        >
                          {{ item.element.name }}</span
                        >
                        .
                      </span>
                      <span
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
        <img src="@/assets/images/message_2.png" @click="addComment" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Avatar from '@/components/common/Avatar'
import input, { resetSelectData, select } from '@/store/input'
import data from '@/store/juus'
import { setting } from '@/store/setting'
import { nextTick, ref } from 'vue'
import draggable from 'vuedraggable'

defineProps(['screenshot'])

const dom = ref(null)
const commentList = ref(null)

const scrollToBottom = () => {
  nextTick(() => {
    dom.value.scrollTo({
      top: commentList.value.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const addComment = () => {
  data.list[data.index].comment.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线',
    reply: []
  })
  scrollToBottom()
  input.text = ''
}

const delComment = index => {
  resetSelectData()
  data.list[data.index].comment.splice(index, 1)
}

const addReply = (index, e) => {
  data.list[data.index].comment?.[index].reply.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线'
  })
  nextTick(() => {
    const temp =
      e.target.parentElement.parentElement.parentElement.nextElementSibling
    const top = temp
      ? temp.offsetTop - 640 + 24
      : commentList.value.scrollHeight
    dom.value.scrollTo({ top, behavior: 'smooth' })
  })
  input.text = ''
}

const delReply = (index, key) => {
  resetSelectData()
  data.list[data.index].comment?.[index].reply.splice(key, 1)
}

const juusChange = (key, e) => {
  data.list[data.index].juus[key] = e.target.innerText
}

const commentChange = (key, index, e) => {
  data.list[data.index].comment[index][key] = e.target.innerText
}

const replyChange = (key, comment, index, e) => {
  data.list[data.index].comment[comment].reply[index][key] = e.target.innerText
}

const avatarClick = (type, index, key) => {
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
  select.index = index
  select.key = key
}

let tempList = []

const _addComment = i => {
  if (!setting.play) return

  data.list[data.index].comment.push({
    ...tempList[i],
    reply: []
  })
  nextTick(() => {
    scrollToBottom()

    if (tempList[i].reply.length > 0) {
      setTimeout(() => {
        _addReply(i, 0)
      }, setting.interval)
    } else {
      if (tempList[i + 1]) {
        setTimeout(() => {
          _addComment(i + 1)
        }, setting.interval)
      } else {
        setting.play = false
      }
    }
  })
}

const _addReply = (i, j) => {
  if (!setting.play) return

  data.list[data.index].comment?.[i].reply.push(tempList[i].reply[j])
  nextTick(() => {
    scrollToBottom()

    if (tempList[i].reply[j + 1]) {
      setTimeout(() => {
        _addReply(i, j + 1)
      }, setting.interval)
    } else {
      if (tempList[i + 1]) {
        setTimeout(() => {
          _addComment(i + 1)
        }, setting.interval)
      } else {
        setting.play = false
      }
    }
  })
}

const autoPlay = () => {
  if (setting.play || data.list[data.index].comment.length < 1) return

  setting.play = true

  tempList = data.list[data.index].comment
  data.list[data.index].comment = []

  setTimeout(() => {
    _addComment(0)
  }, 100)
}

const reset = () => {
  setting.play = false
  data.list[data.index].comment = tempList
  tempList = []
  nextTick(() => {
    dom.value.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  })
}

window.test = autoPlay

defineExpose({ dom, autoPlay, reset })
</script>

<style lang="stylus" src="./Content.styl" scoped></style>