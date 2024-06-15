<template>
  <Transition name="fade">
    <div
      v-if="!setting.juus.home && currentJUUs"
      class="juus"
    >
      <div
        class="mask"
        v-if="setting.play"
      ></div>
      <div class="juus-wrapper">
        <Background
          :img="currentJUUs.bg"
          :type="2"
        />
        <div class="image-wrapper">
          <div class="logo">
            <div class="icon">
              <Logo />
            </div>
            <div class="line"></div>
            <span>JUUSTAGRAM</span>
          </div>
          <div
            class="image"
            @click.stop="imageChange"
          >
            <ChangeImage />
            <img :src="currentJUUs.img" />
          </div>
          <div class="info-icon">
            <Heart
              :highlight="currentJUUs.like.flag"
              @click="setLike"
            />
            <Message @click.stop="contentRef?.inputFource()" />
            <PaperAirplane @click.stop="$emit('screenshot')" />
          </div>
          <div class="info-text">
            <div>
              <span
                contenteditable
                @keydown.enter.prevent="(e) => (e.target as HTMLElement).blur()"
                @focus="initLikeInput"
                @blur="updateLikeNum"
                @beforeinput="beforeLikeInput"
              >
                {{ likeNum }}
              </span>
              <span>次赞</span>
              <EllipsisHorizontalCircleOutline
                v-show="isLikeMoreThan999"
                @click.stop="likeEllipsisChange"
              />
            </div>
            <span>{{ time }}</span>
          </div>
        </div>
        <Content ref="contentRef" />
      </div>
      <div
        v-show="!setting.screenshot"
        class="back"
        @click="back"
      >
        <img src="@/assets/images/back.png" />
        <span>返回</span>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { popupManager } from '@/assets/scripts/popup'
import Background from '@/components/JUUs/Background.vue'
import Content from '@/components/JUUs/Content.vue'
import Heart from '@/components/Public/Heart.vue'
import {
  ChangeImage,
  EllipsisHorizontalCircleOutline,
  Logo,
  Message,
  PaperAirplane
} from '@/components/Public/Icon'
import { currentJUUs } from '@/store/data'
import { select } from '@/store/select'
import { setting } from '@/store/setting'

defineEmits(['screenshot'])

const time = computed(() => {
  if (!currentJUUs.value) return '-'
  const diff = parseInt(((Date.now() - currentJUUs.value.time) / (1000 * 3600 * 24)).toFixed())
  if (diff < 1) {
    return '刚刚'
  }
  return `${diff}天前`
})

const imageChange = () => {
  popupManager
    .open('cropper', {
      aspectRatio: 1,
      maxWidth: 1280
    })
    .then((res) => {
      if (!currentJUUs.value) return
      currentJUUs.value.img = res.base64
    })
}

const isLikeMoreThan999 = computed(() => {
  if (!currentJUUs.value) return false
  return Number(currentJUUs.value.like.num) > 999
})

const setLike = () => {
  if (!currentJUUs.value) return
  currentJUUs.value.like.flag = !currentJUUs.value.like.flag
  if (currentJUUs.value.like.flag) {
    currentJUUs.value.like.num = String(BigInt(currentJUUs.value.like.num) + BigInt(1))
  } else {
    currentJUUs.value.like.num = String(BigInt(currentJUUs.value.like.num) - BigInt(1))
  }
}

const likeNum = computed(() => {
  if (!currentJUUs.value) return '0'
  if (currentJUUs.value.like.ellipsis && isLikeMoreThan999.value) {
    return '999+'
  }
  return currentJUUs.value.like.num
})

const beforeLikeInput = (e: Event) => {
  if (isNaN(Number((e as InputEvent).data))) {
    e.preventDefault()
  }
}

const initLikeInput = (e: Event) => {
  if (!currentJUUs.value) return
  ;(e.target as HTMLElement).innerText = currentJUUs.value.like.num
}

const updateLikeNum = (e: Event) => {
  if (!currentJUUs.value) return
  const el = e.target as HTMLElement
  let newText = el.innerText.replace(/[^\d]/g, '').replace(/^0+/, '')

  if (newText === '0' && currentJUUs.value.like.flag) {
    newText = '1'
  } else if (!newText) {
    newText = currentJUUs.value.like.flag ? '1' : '0'
  }

  if (currentJUUs.value.like.ellipsis && Number(newText) > 999) {
    el.innerText = '999+'
  } else if (el.innerText !== newText) {
    el.innerText = newText
  }

  if (currentJUUs.value.like.num !== newText) {
    currentJUUs.value.like.num = newText
  }
}

const likeEllipsisChange = () => {
  if (!currentJUUs.value) return
  currentJUUs.value.like.ellipsis = !currentJUUs.value.like.ellipsis
}

const contentRef = ref<InstanceType<typeof Content> | null>(null)

const back = () => {
  select.show = false
  setting.juus.home = true
}
</script>

<style lang="stylus" scoped>
.juus
  position relative
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%

  .mask
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    z-index 9
    user-select none

  .juus-wrapper
    position relative
    z-index 2
    display flex
    overflow hidden
    width 1050px
    height 640px
    border-radius 10px
    background rgba(200, 200, 200, 0.5)
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
    backdrop-filter blur(30px)

    *::-webkit-scrollbar
      width 0
      height 0

    .image-wrapper
      position relative
      width 650px
      height 640px

      .logo
        position absolute
        top 0
        left 0
        display flex
        align-items center
        padding 0 5px
        height 45px
        border-top-left-radius 10px
        background #000
        user-select none

        .icon
          display flex
          justify-content center
          align-items center
          width 35px
          height 35px
          border-radius 5px
          background #636563

          svg
            flex-shrink 0
            width 120%
            height 120%

        .line
          margin 0 5px
          width 1.5px
          height 35px
          background #636563

        span
          color #636563
          font-size 20px

      .image
        position absolute
        top 50px
        left 70px
        display flex
        justify-content center
        align-items center
        overflow hidden
        width 500px
        height 500px
        border-radius 5px
        cursor pointer
        user-select none

        &:hover
          svg
            opacity 1
            transform translateY(0)

        svg
          position absolute
          top 20px
          padding 8px
          border-radius 50%
          background rgba(233, 233, 233, 0.95)
          color #666
          opacity 0
          transition all 0.2s
          transform translateY(-20px)
          pointer-events none

        img
          width 100%
          height 100%
          pointer-events none
          object-fit cover

      .info-icon
        position absolute
        bottom 40px
        left 70px
        display flex
        align-items center
        width 500px
        color #fff

        svg
          cursor pointer

          &:first-child
            margin-right 15px

          &:last-child
            margin-left auto

      .info-text
        position absolute
        bottom 10px
        left 72px
        display flex
        justify-content space-between
        align-items center
        width 495px
        color #fff
        user-select none

        & > div
          display flex
          align-items center

          &:hover
            svg
              opacity 1

          svg
            margin 2px 0 0 2px
            opacity 0
            cursor pointer
            transition 0.2s all

          span
            font-size 20px

            &:first-child
              overflow hidden
              margin-right 5px
              min-width 35px
              max-width 200px
              text-align center
              text-overflow ellipsis
              white-space nowrap

        span
          font-size 18px

.back
  position absolute
  bottom 10px
  left 30px
  z-index 9
  display flex
  flex-direction column
  align-items center
  align-content center
  width 55px
  cursor pointer

  img
    width 100%

  span
    margin-top 5px
    color #eee
    font-size 24px
</style>
