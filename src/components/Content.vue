<template>
  <div class="content" :class="{ scroll: !isScreenshot }" ref="dom">
    <div class="info-wrapper">
      <div class="tip">·FOLLOWING·</div>
      <div class="info">
        <div
          class="avatar"
          :class="{ 'avatar-highlight': select.show && select.type === 1 }"
          @click="avatarClick(1)"
        >
          <div>
            <img
              v-if="data.list[data.index].juus.avatar"
              :src="data.list[data.index].juus.avatar"
            />
          </div>
        </div>
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
          (item) => `comment-${data.list[data.index].comment.indexOf(item)}`
        "
      >
        <template #item="{ element, index }">
          <div class="comment-card">
            <div class="comment">
              <div
                class="avatar"
                :class="{
                  'avatar-highlight':
                    select.show && select.type === 2 && select.index === index,
                }"
                @click="avatarClick(2, index)"
              >
                <div>
                  <img v-if="element.avatar" :src="element.avatar" />
                </div>
              </div>
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
                :item-key="(item) => 'reply' + element.reply.indexOf(item)"
              >
                <template #item="item">
                  <div class="reply">
                    <div class="reply-del" @click="delReply(index, item.index)">
                      ×
                    </div>
                    <div
                      class="avatar"
                      :class="{
                        'avatar-highlight':
                          select.show &&
                          select.type === 3 &&
                          select.index === index &&
                          select.key === item.index,
                      }"
                      @click="avatarClick(3, index, item.index)"
                    >
                      <div>
                        <img
                          v-if="item.element.avatar"
                          :src="item.element.avatar"
                        />
                      </div>
                    </div>
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
        <div
          class="avatar"
          :class="{ 'avatar-highlight': select.show && select.type === 0 }"
          @click="avatarClick(0)"
        >
          <div>
            <img v-if="input.avatar" :src="input.avatar" />
          </div>
        </div>
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
import { ref, nextTick } from 'vue'
import data from '@/store/data'
import input, { select, resetSelectData } from '@/store/input'
import draggable from 'vuedraggable'

defineProps(['isScreenshot'])

const dom = ref(null)
const commentList = ref(null)
defineExpose({ dom })

const addComment = () => {
  data.list[data.index].comment.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线',
    reply: []
  })
  nextTick(() => {
    dom.value.scrollTo({ top: commentList.value.scrollHeight, behavior: 'smooth' })
  })
  input.text = ''
}

const delComment = (index) => {
  resetSelectData()
  data.list[data.index].comment.splice(index, 1)
}

const addReply = (index, e) => {
  data.list[data.index].comment?.[index].reply.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线'
  })
  nextTick(() => {
    const top =
      e.target.parentElement.parentElement.parentElement.nextElementSibling
        ? e.target.parentElement.parentElement.parentElement.nextElementSibling.offsetTop - 640 + 24
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
</script>

<style lang="stylus" src="./Content.styl" scoped></style>
