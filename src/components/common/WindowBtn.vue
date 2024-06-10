<template>
  <div
    class="window-btn"
    :class="[`type-${type}`]"
  >
    <span>
      <slot></slot>
    </span>
    <div class="bg bg-a"></div>
    <div class="bg bg-b"></div>
    <div class="rect rect-a"></div>
    <div class="rect rect-b"></div>
    <div class="rect rect-c"></div>
    <div class="triangle"></div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    type?: 1 | 2 | 3
  }>(),
  {
    type: 1
  }
)
</script>

<style lang="stylus" scoped>
.type-1
  .bg-a
    background linear-gradient(to bottom, #7f8084, #a1a3a4 60%)

  .bg-b
    background linear-gradient(to bottom, #a2a3a5, #afafb1 60%)

.type-2
  .bg-a
    background linear-gradient(to bottom, #7e3d31, #bf544b 60%)

  .bg-b
    background linear-gradient(to bottom, #b86153, #c15c54 60%)

.type-3
  .bg-a
    background linear-gradient(to bottom, #345382, #4781cb 60%)

  .bg-b
    background linear-gradient(to bottom, #4e76b0, #5691d6 60%)

.window-btn
  position relative
  z-index 999
  display flex
  justify-content center
  align-items center
  margin 10px
  width 140px
  height 50px
  filter drop-shadow(0px 0px 5px rgba(0, 0, 0, 0.5))
  cursor pointer
  user-select none

  &:hover
    .bg
      filter brightness(1.05)

  span
    z-index 1
    color #fff
    text-indent 5px
    letter-spacing 5px
    font-size 28px

  .bg
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    box-shadow 0 0 0 1px rgba(255, 255, 255, 0.5) inset

  .bg-a
    clip-path polygon(0 0, 30% 0, 90% 100%, 11px 100%, 0 calc(100% - 11px))

  .bg-b
    clip-path polygon(29% 0, 100% 0, 100% 100%, 89% 100%)

  .rect
    position absolute
    width 3px
    height 3px
    background #fff

  .rect-a
    top 0
    left 0

  .rect-b
    top 0
    right 0

  .rect-c
    right 0
    bottom 0

  .triangle
    position absolute
    bottom 0
    left 0
    width 9px
    height 9px
    background #fff
    clip-path polygon(0 0, 0% 100%, 100% 100%)
</style>
