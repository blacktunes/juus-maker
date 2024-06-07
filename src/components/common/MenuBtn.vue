<template>
  <Component
    :is="href ? 'a' : 'div'"
    :href
    target="_blank"
    class="menu-btn"
  >
    <div
      class="icon"
      v-if="$slots.icon"
    >
      <slot name="icon"></slot>
    </div>
    <div class="text">
      <slot></slot>
    </div>
  </Component>
</template>

<script lang="ts" setup>
defineProps<{
  href?: string
}>()
</script>

<style lang="stylus" scoped>
.menu-btn
  display flex
  flex-shrink 0
  justify-content center
  align-items center
  box-sizing border-box
  padding 2px 5px
  height 40px
  border 1px solid rgba(200, 200, 200, 0.5)
  border-right-color transparent
  border-left-color transparent
  background #fff
  cursor pointer

  &:first-child
    border-left-color rgba(200, 200, 200, 0.5)
    border-radius 20px 0 0 20px

  &:last-child
    border-right-color rgba(200, 200, 200, 0.5)
    border-radius 0 20px 20px 0

  &:hover
    background #eff7ff

  .icon
    display flex
    justify-content center
    align-items center
    overflow hidden
    box-sizing border-box
    padding 1px
    width 30px
    height 30px
    border-radius 50%
    background #eff7ff

    *
      width 100%
      height 100%

  .text
    margin 0 5px
    color #666
    font-size 20px
    user-select none

a
  color #666
  text-decoration none
  font-size 20px
  user-select none
</style>
