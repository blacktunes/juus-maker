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
          <div
            class="del"
            @click.stop="delJUUs(index)"
          >
            ×
          </div>
          <div class="info">
            <Avatar
              :width="70"
              :img="item.juus.avatar"
              :type="2"
            />
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
        <div
          class="item add"
          @click="addJUUs"
        >
          <img src="@/assets/images/camera_add.png" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import data, { defaultItem } from '@/store/juus'
import { computed } from 'vue'
import like from '@/assets/images/like.png'
import like_2 from '@/assets/images/like_2.png'
import Avatar from '@/components/common/Avatar3.vue'

const bg = computed(() =>
  data.index >= 0 && data.list?.[data.index]?.bg ? data.list[data.index].bg : data.bg
)

const getLikeImg = (flag: boolean) => (flag ? like_2 : like)

const showJUUs = (index: number) => {
  data.index = index
  data.home = false
}

const addJUUs = () => {
  data.list.unshift(JSON.parse(JSON.stringify(defaultItem)))
  showJUUs(0)
}

const delJUUs = (index: number) => {
  const flag = confirm('是否删除该JUUs')
  if (flag) {
    data.list.splice(index, 1)
  }
}
</script>

<style lang="stylus" scoped>
.home-view
  position absolute
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%

  .bg
    position absolute
    top 0
    left 0
    z-index 1
    width 100%
    height 100%
    filter blur(10px)
    user-select none

    img
      position absolute
      top 0
      left 50%
      height 100%
      transform translateX(-50%)

  .home-wrapper
    z-index 2
    display flex
    overflow hidden
    width 1050px
    height 550px
    border-radius 5px
    background rgba(200, 200, 200, 0.5)
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
    backdrop-filter blur(30px)

    .item-list
      overflow-y scroll
      margin 30px
      width 100%

      &::-webkit-scrollbar
        width 15px
        height 15px

      &::-webkit-scrollbar-track
        border-radius 10px
        background-color rgba(200, 200, 200, 0.5)

      &::-webkit-scrollbar-thumb
        border-radius 10px
        background-color rgba(255, 255, 255, 0.9)

      &::-webkit-scrollbar-thumb:active
        background-color rgba(200, 200, 200, 0.9)

      .item
        position relative
        display flex
        align-items center
        margin-bottom 20px
        width 930px
        height 100px
        border-radius 5px
        background #eee
        cursor pointer
        transition box-shadow 0.25s
        user-select none

        &:hover
          box-shadow 1px 1px 10px rgba(0, 0, 0, 0.4)

          .del
            opacity 1

        .del
          position absolute
          top 5px
          right 10px
          font-size 20px
          opacity 0
          cursor pointer
          transition opacity 0.25s
          user-select none

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
            width 65px
            height 65px
            cursor pointer

            div
              overflow hidden
              box-sizing border-box
              padding 1px
              height 100%
              border 1px solid #666
              border-radius 50%
              background #ddd

              img
                width 100%
                height 100%
                user-select none
                object-fit cover
                object-position center

          .name
            overflow hidden
            width 100%
            text-align center
            text-overflow ellipsis
            white-space nowrap

      .img
        display flex
        justify-content center
        align-items center
        margin auto 20px
        width 70px

        img
          width 100%

      .text
        flex 1
        overflow hidden
        text-overflow ellipsis
        white-space nowrap
        font-size 20px

      .like
        display flex
        flex 0 0 150px
        align-items center
        overflow hidden

        .like-img
          width 42px
          height 42px
          user-select none

          img
            height 100%

        .like-num
          margin-left 25px
          font-size 20px

.add
  justify-content center

  img
    width 45px
</style>
