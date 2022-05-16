<template>
  <div class="content" :class="{ hidden: !isScreenshot }" ref="dom">
    <div class="info-wrapper">
      <div class="tip">·FOLLOWING·</div>
      <div class="info">
        <div class="avatar">
          <img v-if="data.juus.avatar" :src="data.juus.avatar" />
        </div>
        <img src="@/assets/images/sep.png" class="sep" />
        <div class="name">
          @<span contenteditable @keydown.enter.prevent="" @input="juusChange('name', $event)">
            {{ data.juus.name }}
          </span>
        </div>
        <img src="@/assets/images/icon.png" />
      </div>
    </div>
    <div class="text-wrapper">
      <div class="text" contenteditable @keydown.enter.prevent="" @input="juusChange('text', $event)">
        {{ data.juus.text }}
      </div>
      <div class="line"></div>
    </div>
    <div class="comment-list">
      <div class="comment-card" v-for="(item, index) in data.comment" :key="`comment-${index}`"
        @dragend="commentDragend(index)" @dragover="commentDragover(index)">
        <div class="comment">
          <div class="avatar">
            <img v-if="item.avatar" :src="item.avatar" />
          </div>
          <div>
            <span class="name" contenteditable @keydown.enter.prevent="" @input="commentChange('name', index, $event)">
              {{ item.name }}.
            </span>
            <span contenteditable @keydown.enter.prevent="" @input="commentChange('text', index, $event)">
              {{ item.text }}
            </span>
          </div>
        </div>
        <div class="comment-del" @click="delComment(index)">×</div>
        <div class="reply-num-wrapper">
          <div></div>
          <div>reply</div>
          <div class="reply-num">
            <img src="@/assets/images/message_3.png" @click="addReply(index)" />
            <div class="text">{{ item.reply.length }}</div>
          </div>
        </div>
        <div class="reply-list">
          <div class="reply" v-for="(reply, key) in item.reply" :key="`${index}-${key}`"
            @dragstart="replyDragstart(index)" @dragend="replyDragend(index, key)"
            @dragover="replyDragover(index, key)">
            <div class="reply-del" @click="delReply(index, key)">×</div>
            <div class="avatar">
              <img v-if="reply.avatar" :src="reply.avatar" />
            </div>
            <div style="flex: 1">
              <span class="name"><span contenteditable @keydown.enter.prevent=""
                  @input="replyChange('name', index, key, $event)">
                  {{ reply.name }}</span>
                .
              </span>
              <span contenteditable @keydown.enter.prevent="" @input="replyChange('text', index, key, $event)">
                {{ reply.text }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="add-comment" @click="addComment">
      <div class="left">
        <div class="avatar"></div>
        <div class="text">Add a comment...</div>
      </div>
      <img src="@/assets/images/message_2.png" class="right" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import data from '@/store/data'

defineProps(['isScreenshot'])

const dom = ref()
defineExpose({ dom })

const addComment = () => {
  data.comment.push({
    avatar: '',
    name: '这是名字',
    text: '这是内容',
    reply: []
  })
}

const delComment = (index) => {
  data.comment.splice(index, 1)
}

const addReply = (index) => {
  data.comment?.[index].reply.push({
    avatar: '',
    name: '这是名字',
    text: '这是内容'
  })
}

const delReply = (index, key) => {
  data.comment?.[index].reply.splice(key, 1)
}

const juusChange = (key, e) => {
  data.juus[key] = e.target.innerText
}

const commentChange = (key, index, e) => {
  data.comment[index][key] = e.target.innerText
}

const replyChange = (key, comment, index, e) => {
  data.comment[comment].reply[index][key] = e.target.innerText
}

let commentTarget = -1
const commentDragend = (index) => {
  if (index !== commentTarget && commentTarget >= 0) {
    moveItem(data.comment, index, commentTarget)
    commentTarget = -1
  }
}
const commentDragover = (index) => {
  if (index !== commentTarget) {
    commentTarget = index
  }
}

let commentIndex = -1
let replyTarget = -1
const replyDragstart = (index) => {
  commentIndex = index
}
const replyDragend = (index, key) => {
  if (index === commentIndex && key !== replyTarget && commentIndex >= 0 && replyTarget >= 0) {
    moveItem(data.comment[index].reply, key, replyTarget)
    commentIndex = -1
    replyTarget = -1
  }
}
const replyDragover = (index, key) => {
  if (index === commentIndex && key !== replyTarget) replyTarget = key
}

const moveItem = (arr, index, target) => {
  if (index > target) {
    arr.splice(target, 0, arr[index])
    arr.splice(index + 1, 1)
  } else {
    arr.splice(target + 1, 0, arr[index])
    arr.splice(index, 1)
  }
}
</script>

<style lang="stylus" src="./Content.styl" scoped></style>
