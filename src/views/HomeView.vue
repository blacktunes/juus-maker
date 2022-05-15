<template>
  <div class="share" @click="screenshot">
    <img src="@/assets/images/share.png" />
  </div>
  <div class="share" style="right: 45px" @click="changeBg">
    <img src="@/assets/images/img_icon.png" />
  </div>
  <div class="main" :style="{ width, height }">
    <div class="wrapper" :style="{ transform: `scale(${scale})` }">
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
          <div
            class="text text-right"
            contenteditable
            @keydown.enter.prevent=""
          >
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
                  <div class="avatar">
                    <img v-if="reply.avatar" :src="reply.avatar" />
                  </div>
                  <div>
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
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import domtoimage from 'dom-to-image'

const scale = ref(1)
const width = computed(() => `${1280 * scale.value}px`)
const height = computed(() => `${720 * scale.value}px`)

const setSize = () => {
  const h = window.innerWidth / 1280
  const v = window.innerHeight / 720
  scale.value = Math.min(h, v)
}
setSize()

window.onresize = () => {
  setSize()
}

const data = reactive({
  bg: require('@/assets/images/bg.png'),
  img: require('@/assets/images/img.png'),
  like: {
    flag: false,
    text: '999+'
  },
  time: '刚刚',
  juus: {
    avatar: '',
    name: 'Ташкент',
    text: '北方联合的兔兔，超凶，嘎哦！'
  },
  // TODO 增加一个字典用来检索名字和头像
  comment: [
    {
      avatar: '',
      name: 'HAl_110',
      text: '嘎哦！~',
      reply: [
        {
          avatar: '',
          name: 'Ташкент',
          text: '嘎哦！！'
        }
      ]
    }
  ]
})

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

const addReply = (index) => {
  data.comment?.[index].reply.push({
    avatar: '',
    name: '这是名字',
    text: '这是内容'
  })
}

const isScreenshot = ref(false)
const content = ref(null)
const screenshot = () => {
  isScreenshot.value = true
  domtoimage.toPng(content.value)
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
</script>

<style lang="stylus" scoped>
.share
  position fixed
  top 5px
  right 5px
  width 35px
  height 35px
  cursor pointer
  user-select none

  img
    width 100%

.main
  overflow hidden
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  margin auto

  .wrapper
    width 1280px
    height 720px
    transform-origin left top
    background #fff
    display flex
    justify-content center
    align-items center

    .bg
      z-index -1
      position absolute
      top 0
      right 0
      height 100%
      filter blur(10px)

    .juus-wrapper
      overflow hidden
      width 1050px
      height 640px
      background rgba(255, 255, 255, 0.5)
      box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
      border-radius 5px
      display flex

      .image
        width 650px
        height 640px
        position relative

        .logo
          position absolute
          top 0
          left 0
          user-select none

        .img-wrapper
          overflow hidden
          position absolute
          top 50px
          left 70px
          height 500px
          width 500px
          cursor pointer
          border-radius 5px

        .img
          height 100%
          user-select none

        .icon-left
          position absolute
          bottom 45px
          left 70px

          .icon
            width 32px
            height 32px
            user-select none

          .like
            margin-right 25px
            cursor pointer

        .icon-right
          position absolute
          bottom 45px
          right 75px

        .text-left
          position absolute
          bottom 10px
          left 70px
          font-size 20px
          color #fff
          filter blur(1px)
          user-select none

        .text-right
          position absolute
          bottom 15px
          right 75px
          font-size 18px
          color #fff
          filter blur(1px)
          user-select none

      .content
        flex 1
        display flex
        flex-direction column
        background #eff7ff
        width 400px

        &::-webkit-scrollbar
          width 0
          height 0

        .info-wrapper
          z-index 9
          position sticky
          top 0
          width 100%
          background #fff
          border-radius 0 0 25px 25px
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

            .avatar
              overflow hidden
              width 65px
              height 65px
              border-radius 50%
              border 2px solid #f7e5a2
              margin-left 30px

              img
                width 100%
                user-select none

            .sep
              margin 0 15px

            .name
              font-size 20px
              margin-right 10px

        .text-wrapper
          position sticky
          top 120px
          padding-bottom 5px
          background #eff7ff

          .text
            margin-top 10px
            padding 20px 25px 40px 25px
            font-size 18px

          .line
            border 1px solid
            width 90%
            margin-left 10%
            transform scaleY(0.1)

        .comment-list
          flex 1
          color #a1a1a2
          background #eff7ff

          .comment-card
            box-sizing border-box
            width 380px
            margin 12px 5px 12px 15px
            padding 15px
            border-radius 5px
            background #fff
            display flex
            flex-direction column

            .comment
              display flex

              .avatar
                overflow hidden
                flex-shrink 0
                width 45px
                height 45px
                border-radius 50%
                border 1px solid #dedddb
                margin 0 15px 0 10px
                background #ddd
                user-select none

              .name
                color #000
                font-weight bold

            .reply-num-wrapper
              height 30px
              margin-bottom 10px
              display flex
              align-items center
              justify-content space-between
              font-size 14px
              user-select none

              .reply-num
                display flex
                align-items center

                img
                  cursor pointer

                .text
                  margin-left 5px

            .reply-list
              display flex
              flex-direction column

              .reply
                display flex
                margin 10px 20px 10px 65px

                .avatar
                  overflow hidden
                  flex-shrink 0
                  width 45px
                  height 45px
                  border-radius 50%
                  border 1px solid #dedddb
                  margin 0 15px 0 10px
                  background #ddd
                  user-select none

                .name
                  color #000
                  font-weight bold

        .add-comment
          position sticky
          bottom 0
          height 60px
          width 100%
          display flex
          align-items center
          justify-content space-between
          background #fff
          box-shadow 0 -1px 2px 0px rgba(0, 0, 0, 0.3)
          cursor pointer

          .left
            display flex
            align-items center
            height 60px

            .avatar
              overflow hidden
              width 45px
              height 45px
              border-radius 50%
              border 1px solid #dedddb
              margin 0 15px 0 10px
              background #ddd

            .text
              font-size 20px
              color #dfdfdf
              user-select none

          .right
            margin-right 10px

.hidden
  overflow-x hidden
  overflow-y scroll
</style>
