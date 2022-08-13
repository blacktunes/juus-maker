<template>
  <div class="talk-wrapper">
    <ShipSelect class="select" />
    <div class="talk" ref="dom">
      <div class="talk-list">
        <div v-for="(item, index) in data.list" :key="index">
          <div class="item" v-if="item.key !== '指挥官'">
            <Avatar
              :src="item.avatar"
              v-if="index === 0 || item.key !== data.list[index - 1].key"
            />
            <div v-else class="empty"></div>
            <div>
              <div
                class="name"
                v-if="index === 0 || item.key !== data.list[index - 1].key"
              >
                {{ item.name }}
              </div>
              <div class="text">{{ item.text }}</div>
            </div>
          </div>
          <div class="item" :class="{ right: item.key === '指挥官' }" v-else>
            <div class="text">{{ item.text }}</div>
          </div>
        </div>
      </div>
      <div class="add-comment">
        <div class="left">
          <Avatar
            :highlight="select.show && select.type === 0"
            :src="input.avatar"
            style="margin: 0 15px 0 10px"
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
  </div>
</template>

<script setup>
import ship from '@/assets/data'
import screenshot from '@/assets/scripts/screenshot'
import Avatar from '@/components/common/Avatar'
import ShipSelect from '@/components/ShipSelect.vue'
import input, { select } from '@/store/input'
import data from '@/store/talk'
import { ref } from 'vue'

const dom = ref(null)

const addComment = () => {
  data.list.push({
    ...input,
    text: input.text || '谢谢你，碧蓝航线'
  })
  input.text = ''
}

window.test = () => {
  input.key = '指挥官'
  input.avatar = ship['指挥官'].avatar
  input.name = '指挥官'
  screenshot(dom.value)
}
</script>

<style lang="stylus" scoped>
.talk-wrapper
  display flex

.select
  position sticky
  top 0
  flex 1

.talk
  display flex
  flex-direction column
  max-width 100%
  width 400px
  min-height 100vh
  background #eff7ff

  .talk-list
    flex 1
    overflow-x hidden
    padding 15px

    .item
      display flex

      .empty
        width 45px

      .name
        font-weight bold
        margin-left 10px

      .text
        padding 10px
        margin 5px 10px
        border-radius 5px
        background rgb(76, 91, 112)
        color #fff

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

  .left
    display flex
    align-items center
    height 60px
    flex 1

    .input
      font-size 20px
      color #666
      padding 5px 10px
      height 26px
      border none
      width 240px

  .right
    display flex
    justify-content center
    align-items center
    width 40px
    margin-right 10px
    user-select none
    cursor pointer

    img
      width 100%

.right
  flex-direction row-reverse
</style>

<style lang="stylus">
::-webkit-scrollbar
  width 0
  height 0
</style>
