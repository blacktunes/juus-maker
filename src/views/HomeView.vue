<template>
  <div class="home-view">
    <div class="bg">
      <img :src="bg" />
    </div>
    <div class="home-wrapper">
      <div class="item-list">
        <div
          class="item"
          v-for="(item, index) in data.list"
          :key="`home-${index}`"
          @click="showJUUs(index)"
        >
          <div class="del" @click.stop="delJUUs(index)">×</div>
          <div class="info">
            <div class="avatar">
              <div>
                <img v-if="item.juus.avatar" :src="item.juus.avatar" />
              </div>
            </div>
            <div class="name">
              {{ item.juus.name }}
            </div>
          </div>
          <div class="img">
            <img :src="item.img" />
          </div>
          <div class="text">
            {{ item.juus.text }}
          </div>
          <div class="like">
            <div class="like-img">
              <img :src="getLikeImg(item.like.flag)" />
            </div>
            <div class="like-num">
              {{ item.like.text }}
            </div>
          </div>
        </div>
        <div class="item add" @click="addJUUs">
          <img src="@/assets/images/camera_add.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import data, { defaultItem } from '@/store/data'
import { computed } from '@vue/runtime-core'

const bg = computed(() => data.index >= 0 && data.list?.[data.index]?.bg ? data.list[data.index].bg : data.bg)

const getLikeImg = (flag) => flag ? require('@/assets/images/like_2.png') : require('@/assets/images/like.png')

const showJUUs = (index) => {
  data.index = index
  data.home = false
}

const addJUUs = () => {
  data.list.push(defaultItem)
  showJUUs(data.list.length - 1)
}

const delJUUs = (index) => {
  data.list.splice(index, 1)
}
</script>

<style lang="stylus" scoped>
.home-view
  position absolute
  width 100%
  height 100%
  display flex
  justify-content center
  align-items center

  .bg
    z-index 1
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    filter blur(10px)
    user-select none

    img
      position absolute
      top 0
      left 50%
      transform translateX(-50%)
      height 100%

  .home-wrapper
    z-index 2
    overflow hidden
    width 1050px
    height 550px
    background rgba(200, 200, 200, 0.5)
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
    border-radius 5px
    display flex

    .item-list
      width 100%
      overflow-y scroll
      margin 30px

      &::-webkit-scrollbar
        width 15px
        height 15px

      &::-webkit-scrollbar-track
        background-color rgba(200, 200, 200, 0.5)
        border-radius 10px

      &::-webkit-scrollbar-thumb
        background-color rgba(255, 255, 255, 0.9)
        border-radius 10px

      &::-webkit-scrollbar-thumb:active
        background-color rgba(200, 200, 200, 0.9)

      .item
        position relative
        display flex
        align-items center
        width 930px
        height 100px
        background #eee
        border-radius 5px
        margin-bottom 20px
        user-select none
        cursor pointer
        transition box-shadow 0.25s

        &:hover
          box-shadow 1px 1px 10px rgba(0, 0, 0, 0.4)

          .del
            opacity 1

        .del
          opacity 0
          position absolute
          right 10px
          top 5px
          font-size 20px
          cursor pointer
          user-select none
          transition opacity 0.25s

          &:hover
            opacity 1

        .info
          display flex
          flex-direction column
          align-items center
          margin auto 20px
          width 100px

          .avatar
            position relative
            cursor pointer
            width 70px
            height 70px

            div
              box-sizing border-box
              overflow hidden
              background #ddd
              border-radius 50%
              border 1px solid #666
              padding 1px
              height 100%

              img
                width 100%
                height 100%
                object-fit cover
                object-position center
                user-select none

          .name
            width 100%
            text-overflow ellipsis
            white-space nowrap
            overflow hidden
            text-align center

      .img
        width 80px
        margin auto 20px

        img
          width 100%

      .text
        flex 1
        font-size 20px
        text-overflow ellipsis
        white-space nowrap
        overflow hidden

      .like
        overflow hidden
        flex 0 0 150px
        display flex
        align-items center

        .like-img
          width 32px
          height 32px
          user-select none

        .like-num
          margin-left 30px
          font-size 20px

.add
  justify-content center

  img
    width 45px
</style>
