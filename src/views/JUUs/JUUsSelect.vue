<template>
  <div class="home-view">
    <div class="home-wrapper">
      <div class="item-list">
        <div
          class="item"
          v-for="(item, index) in list"
          :key="`home-${index}`"
          @click="showJUUs(item.id)"
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
              {{ item.like.num }}
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
      <Background
        :img="currentBg"
        :type="1"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import like from '@/assets/images/like.png'
import like_2 from '@/assets/images/like_2.png'
import Background from '@/components/JUUs/Background.vue'
import Avatar from '@/components/Common/Avatar3.vue'
import { data, getDefaultJUUs } from '@/store/data'
import { setting } from '@/store/setting'
import { currentBg } from './JUUs'

defineProps<{
  list: JUUsData[]
}>()

const getLikeImg = (flag: boolean) => (flag ? like_2 : like)

const showJUUs = (id: number) => {
  setting.juus.home = false
  setting.juus.id = id
  setting.juus.lastID = data.juus.findIndex((item) => item.id === id)
}

const addJUUs = () => {
  const newJuus = getDefaultJUUs()
  data.juus.push(newJuus)
  showJUUs(newJuus.id)
}

const delJUUs = (index: number) => {
  const flag = confirm('是否删除该JUUs')
  if (flag) {
    data.juus.splice(index, 1)
  }
}
</script>

<style lang="stylus" scoped>
.home-view
  position absolute
  z-index 5
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%

  .home-wrapper
    position relative
    z-index 2
    display flex
    overflow hidden
    width 1050px
    height 550px
    border-radius 5px
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)

    .item-list
      overflow-y scroll
      margin 30px
      width 100%

      &::-webkit-scrollbar
        width 15px
        height 15px

      &::-webkit-scrollbar-track
        margin-top 40px
        border-radius 10px
        background-color rgba(200, 200, 200, 0.5)

      &::-webkit-scrollbar-thumb
        border-radius 10px
        background-color rgba(255, 255, 255, 0.9)

      &::-webkit-scrollbar-thumb:active
        background-color rgba(240, 240, 240, 0.9)

      .item
        position relative
        display flex
        align-items center
        margin-bottom 30px
        width 930px
        height 100px
        border-radius 5px
        background #eee
        cursor pointer
        transition box-shadow 0.25s
        user-select none

        &:last-child
          margin-bottom 0

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
