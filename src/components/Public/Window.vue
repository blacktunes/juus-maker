<template>
  <div class="window">
    <div
      class="box"
      :style="{
        width,
        height,
        minWidth,
        minHeight
      }"
      @click.stop
    >
      <div class="line-1"></div>
      <div class="line-2"></div>
      <div class="line-3"></div>
      <div class="line-4">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="tip">
        <span>MESSAGE</span>
        <div></div>
      </div>
      <Info class="info" />
      <div class="triangle"></div>
      <div class="header">
        <div class="title">
          <div class="header-bg-1"></div>
          <div class="header-bg-2"></div>
          <div class="title-text">
            <span>{{ title }}</span>
            <span>{{ subTitle }}</span>
          </div>
        </div>
        <div
          class="close"
          @click.stop="close"
        >
          <div class="cloese-bg-1"></div>
          <div class="cloese-bg-2"></div>
          <Close />
        </div>
      </div>
      <div class="wrapper">
        <div class="content">
          <slot></slot>
        </div>
      </div>
      <div
        class="footer"
        v-if="$slots.footer"
      >
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Close, Info } from './Icon'

withDefaults(
  defineProps<{
    title?: string
    subTitle?: string
    width?: string
    minWidth?: string
    height?: string
    minHeight?: string
  }>(),
  {
    title: '信息',
    subTitle: 'INFORMATION',
    width: '40%',
  }
)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const close = () => {
  emit('close')
}
</script>

<style lang="stylus" scoped>
.window
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 9
  display flex
  justify-content center
  align-items center
  overflow hidden
  background rgba(0, 0, 0, 0.2)

  .box
    position relative
    display flex
    flex-direction column
    max-width 90%
    max-height 90%
    width fit-content
    width -moz-fit-content
    height fit-content
    height -moz-fit-content
    background rgba(150, 160, 175, 0.8)

    .line-1
      position absolute
      top 1px
      left 50%
      z-index -1
      width 1280px
      height 1px
      background rgba(255, 255, 255, 0.2)
      transform translateX(-50%)

    .line-2
      position absolute
      bottom 1px
      left 0
      z-index -1
      width 1280px
      height 1px
      background rgba(255, 255, 255, 0.2)

    .line-3
      position absolute
      top 50%
      left 1px
      z-index -1
      width 1px
      height 720px
      background rgba(255, 255, 255, 0.2)
      transform translateY(-50%) scaleX(0.5)

    .line-4
      position absolute
      bottom -385px
      left 20px
      z-index -1
      display flex
      flex-direction column
      align-items center
      gap 2px

      div
        &:nth-child(1)
          width 10px
          height 720px
          background rgba(255, 255, 255, 0.1)
          clip-path polygon(0 0, 0 100%, 50% calc(100% - 5px), 100% 100%, 100% 0)

        &:nth-child(2)
          position relative
          margin-bottom 0.5px
          width 15px
          height 15px

          &:after
            position absolute
            top 0
            right 0
            bottom 0
            left 0
            box-sizing border-box
            border 2px solid rgba(255, 255, 255, 0.2)
            content ''
            transform rotate(45deg)

        &:nth-child(3)
          width 10px
          height 720px
          background rgba(255, 255, 255, 0.1)
          clip-path polygon(0 0, 0 100%, 100% 100%, 100% 0, 50% 5px)

    .tip
      position absolute
      top 28px
      left -32px
      display flex
      align-items center
      transform rotate(-90deg)
      transform-origin bottom
      user-select none
      gap 2px

      span
        color rgba(255, 255, 255, 0.5)
        text-indent 2px
        letter-spacing 2px
        font-size 8px
        font-family 'Oxygen', sans-serif

      div
        width 6px
        height 6px
        background #fff

    .info
      position absolute
      top 5px
      right -12px
      width 12px
      height 12px
      color #fff

    .triangle
      position absolute
      right -4px
      bottom -4px
      z-index -1
      width 30px
      height 30px
      background #fff
      clip-path polygon(calc(100% - 4px) 4px, 100% 0, 100% 100%, 0 100%, 4px calc(100% - 4px), calc(100% - 4px) calc(100% - 4px))

    .header
      display flex
      justify-content space-between
      padding 8px 10px
      height 45px
      user-select none

      .title
        position relative
        display flex
        flex 1
        align-items center
        box-sizing border-box
        margin-right 5px
        padding 0 8px

        .header-bg-1
          position absolute
          top 2px
          left 2px
          z-index 1
          width 100%
          height 100%
          background #6989b8

        .header-bg-2
          position absolute
          top 0
          right 0
          bottom 0
          left 0
          z-index 2
          border 1px solid rgba(255, 255, 255, 0.6)
          background linear-gradient(to right, rgb(82, 116, 179), rgba(81, 113, 178, 0.8))

        .title-text
          position relative
          z-index 4
          display flex
          align-items flex-end
          color #fff
          text-indent 1px
          letter-spacing 1px
          gap 5px

          &:after
            position absolute
            bottom 10px
            left 0
            z-index 3
            width 85%
            height 40%
            background linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.05) 75%, transparent 75%, transparent)
            background-size 15px 15px
            content ''

          span
            &:nth-child(1)
              font-size 30px
              font-family 'Noto Serif SC', serif

            &:nth-child(2)
              margin-bottom 4px
              font-size 14px
              font-family 'Oxygen', sans-serif

      .close
        position relative
        display flex
        justify-content center
        align-items center
        width 60px
        height 100%
        cursor pointer

        &:hover
          filter brightness(1.05)

        &:active
          filter brightness(0.95)

        .cloese-bg-1
          position absolute
          top 2px
          left 2px
          z-index 1
          width 100%
          height 100%
          background #a68594

        .cloese-bg-2
          position absolute
          top 0
          right 0
          bottom 0
          left 0
          z-index 2
          background #c75a57

        svg
          z-index 3
          color #fff

    .wrapper
      display flex
      flex 1
      align-items center
      overflow hidden
      box-sizing border-box
      padding 0 10px 10px
      width 100%

      .content
        box-sizing border-box
        padding 10px
        width 100%
        height 100%
        background rgba(0, 0, 0, 0.5)

    .footer
      position relative
      display flex
      justify-content center
      align-content center
      padding-bottom 5px
      gap 100px
</style>
