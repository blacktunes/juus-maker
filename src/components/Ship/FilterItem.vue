<template>
  <div
    class="filter-item"
    :class="{ highlight }"
  >
    <span>
      <slot></slot>
    </span>
    <div class="rect rect-a"></div>
    <div class="rect rect-b"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  highlight?: boolean
}>()
</script>

<style lang="stylus" scoped>
.highlight
  background linear-gradient(to bottom, #56657a, #4781cb) !important

.filter-item
  position relative
  z-index 20
  display flex
  justify-content center
  align-items center
  margin 5px
  width 140px
  height 40px
  border-bottom 1px solid rgba(255, 255, 255, 0.9)
  background linear-gradient(to bottom, #667382, #8490a5 60%)
  box-shadow 0 1px 5px 1px rgba(0, 0, 0, 0.5)
  cursor pointer
  user-select none

  &:hover
    filter brightness(1.05)

  &:active
    filter brightness(0.95)

  span
    z-index 1
    color #fff
    text-indent 1px
    white-space nowrap
    letter-spacing 1px
    font-size 20px
    font-family 'Noto Serif SC', serif

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
</style>
