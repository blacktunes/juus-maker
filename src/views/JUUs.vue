<template>
  <div class="menu">
    <div class="menu-icon" @click="screenshot">
      <img src="@/assets/images/share.png" />
    </div>
    <div class="menu-icon" @click="changeBg">
      <img src="@/assets/images/img_icon.png" />
    </div>
  </div>
  <img :src="data.bg" class="bg" />
  <div class="juus-wrapper">
    <div class="image">
      <img src="@/assets/images/logo.jpg" class="logo" />
      <div class="img-wrapper">
        <img :src="data.img" class="img" @click="changeImg" />
      </div>
      <div class="icon-left">
        <img :src="likeImg" class="icon like" @click="setLike" />
        <img src="@/assets/images/message.png" class="icon" />
      </div>
      <div class="icon-right">
        <img src="@/assets/images/纸飞机.png" class="icon" />
      </div>
      <div class="text text-left">
        <span contenteditable @keydown.enter.prevent="">
          {{ data.like.text }}
        </span>
        次赞
      </div>
      <div class="text text-right" contenteditable @keydown.enter.prevent="">
        {{ data.time }}
      </div>
    </div>
    <div class="content" :class="{ hidden: !isScreenshot }" ref="content">
      <div class="info-wrapper">
        <div class="tip">·FOLLOWING·</div>
        <div class="info">
          <div class="avatar">
            <img v-if="data.juus.avatar" :src="data.juus.avatar" />
          </div>
          <img src="@/assets/images/sep.png" class="sep" />
          <div class="name">
            @<span contenteditable @keydown.enter.prevent="">
              {{ data.juus.name }}
            </span>
          </div>
          <img src="@/assets/images/icon.png" />
        </div>
      </div>
      <div class="text-wrapper">
        <div class="text" contenteditable @keydown.enter.prevent="">
          {{ data.juus.text }}
        </div>
        <div class="line"></div>
      </div>
      <div class="comment-list">
        <div
          class="comment-card"
          v-for="(item, index) in data.comment"
          :key="`comment-${index}`"
        >
          <div class="comment">
            <div class="avatar">
              <img v-if="item.avatar" :src="item.avatar" />
            </div>
            <div>
              <span class="name" contenteditable @keydown.enter.prevent="">
                {{ item.name }}.
              </span>
              <span contenteditable @keydown.enter.prevent="">
                {{ item.text }}
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
                @click="addReply(index)"
              />
              <div class="text">{{ item.reply.length }}</div>
            </div>
          </div>
          <div class="reply-list">
            <div
              class="reply"
              v-for="(reply, key) in item.reply"
              :key="`${index}-${key}`"
            >
              <div class="reply-del" @click="delReply(index, key)">×</div>
              <div class="avatar">
                <img v-if="reply.avatar" :src="reply.avatar" />
              </div>
              <div style="flex: 1">
                <span class="name"
                  ><span contenteditable @keydown.enter.prevent="">
                    {{ reply.name }}</span
                  >
                  .
                </span>
                <span contenteditable @keydown.enter.prevent="">
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
  </div>
  <div class="select-wrapper"></div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import domtoimage from 'dom-to-image'
import ship from '@/assets/scripts/ship'

const data = reactive({
  bg: require('@/assets/images/bg.jpg'),
  img: require('@/assets/images/img.jpg'),
  like: {
    flag: false,
    text: '999+'
  },
  time: '刚刚',
  juus: {
    avatar: '',
    name: '',
    text: ''
  },
  comment: []
})

const getData = (name) => {
  return ship[name]
    ? ship[name]
    : { avatar: '', name: '' }
}

const changeBg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        data.bg = e.target.result
      }
    }
  }
  input.click()
}

const changeImg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        data.img = e.target.result
      }
    }
  }
  input.click()
}

const likeImg = computed(() => data.like.flag ? require('@/assets/images/like_2.png') : require('@/assets/images/like.png'))
const setLike = () => {
  data.like.flag = !data.like.flag
}

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

const isScreenshot = ref(false)
const content = ref(null)
const screenshot = () => {
  isScreenshot.value = true
  domtoimage.toPng(content.value, {
    imagePlaceholder: require('@/assets/images/empty.png')
  })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `JUUs-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    })
    .catch((error) => {
      console.error('oops, something went wrong!', error)
    })
    .finally(() => {
      isScreenshot.value = false
    })
}

// init
const 塔什干 = getData('塔什干')
const U110 = getData('U-110')
data.juus.avatar = 塔什干.avatar
data.juus.name = 塔什干.name
data.juus.text = '北方联合的兔兔，超凶，嘎哦！'
data.comment.push({
  avatar: U110.avatar,
  name: U110.name,
  text: '嘎哦！~',
  reply: []
})
data.comment?.[0].reply.push({
  avatar: 塔什干.avatar,
  name: 塔什干.name,
  text: '嘎哦！！'
})

</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
