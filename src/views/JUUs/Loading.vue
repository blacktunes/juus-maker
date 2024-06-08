<template>
  <div class="loading">
    <div class="loading-window">
      <div class="loading-content">
        <Logo class="svg" />
        <span>JUUS</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Logo } from '@/components/common/Icon'
</script>

<style lang="stylus" scoped>
.loading
  position absolute
  z-index 99
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%

  .loading-window
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 1050px
    height 640px
    border-radius 10px
    background rgba(0, 0, 0, 0.8)
    background-image radial-gradient(rgba(255, 255, 255, 0.01) 30%, transparent 0)
    background-size 8px 8px
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
    backdrop-filter blur(30px)

    .loading-content
      display flex
      flex-direction column
      justify-content center
      align-items center

      .svg
        animation logo 1s infinite alternate

      span
        margin -25px 0 25px
        color #fff
        text-indent 20px
        letter-spacing 20px
        font-size 26px
        animation text 1s infinite alternate

@keyframes logo
  0%
    transform translateY(-40px) scaleX(1.3) scaleY(0.8)

  20%
    transform translateY(-40px) scaleX(1.1) scaleY(0.9)

  50%
    transform translateY(20px) scaleX(1.1) scaleY(0.9)

  100%
    transform translateY(0) scaleX(1) scaleY(1)

@keyframes text
  0%
    transform translateY(0)

  20%
    transform translateY(0)

  50%
    transform translateY(10px)

  100%
    transform translateY(0)
</style>
