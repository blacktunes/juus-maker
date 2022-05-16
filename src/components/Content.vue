<template>
  <div class="content" :class="{ scroll: !isScreenshot }" ref="dom">
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
    <div class="comment-list" ref="commentList">
      <draggable tag="transition-group" :component-data="{ name: 'list', type: 'transition' }" v-model="data.comment"
        :item-key="((item) => 'comment' + data.comment.indexOf(item))">
        <template #item="{ element, index }">
          <div class="comment-card" :key="`comment${index}`">
            <div class="comment">
              <div class="avatar">
                <img v-if="element.avatar" :src="element.avatar" />
              </div>
              <div>
                <span class="name" contenteditable @keydown.enter.prevent=""
                  @input="commentChange('name', index, $event)">
                  {{ element.name }}.
                </span>
                <span contenteditable @keydown.enter.prevent="" @input="commentChange('text', index, $event)">
                  {{ element.text }}
                </span>
              </div>
            </div>
            <div class="comment-del" @click="delComment(index)">×</div>
            <div class="reply-num-wrapper">
              <div></div>
              <div>reply</div>
              <div class="reply-num">
                <img src="@/assets/images/message_3.png" @click="addReply(index)" />
                <div class="text">{{ element.reply.length }}</div>
              </div>
            </div>
            <div class="reply-list">
              <draggable v-model="element.reply" :item-key="((item) => 'reply' + element.reply.indexOf(item))">
                <template #item="item">
                  <div class="reply">
                    <div class="reply-del" @click="delReply(index, item.index)">×</div>
                    <div class="avatar">
                      <img v-if="item.element.avatar" :src="item.element.avatar" />
                    </div>
                    <div style="flex: 1">
                      <span class="name"><span contenteditable @keydown.enter.prevent=""
                          @input="replyChange('name', index, item.index, $event)">
                          {{ item.element.name }}</span>
                        .
                      </span>
                      <span contenteditable @keydown.enter.prevent=""
                        @input="replyChange('text', index, item.index, $event)">
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
import { ref, nextTick } from 'vue'
import data from '@/store/data'
import draggable from 'vuedraggable'

defineProps(['isScreenshot'])

const dom = ref(null)
defineExpose({ dom })

const commentList = ref(null)
const addComment = () => {
  data.comment.push({
    avatar: '',
    name: '这是名字',
    text: '这是内容',
    reply: []
  })
  nextTick(() => {
    dom.value.scrollTop = commentList.value.scrollHeight
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
</script>

<style lang="stylus" src="./Content.styl" scoped></style>
