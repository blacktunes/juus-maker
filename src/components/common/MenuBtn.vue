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
  border 2px solid rgba(222, 222, 222, 0.3)
  border-right none
  border-left none
  background rgba(250, 250, 250, 0.2)
  cursor pointer

  &:first-child
    border-left 2px solid rgba(222, 222, 222, 0.3)
    border-radius 20px 0 0 20px

  &:last-child
    border-right 2px solid rgba(222, 222, 222, 0.3)
    border-radius 0 20px 20px 0

  &:hover
    background rgba(222, 222, 222, 0.5)

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
    background rgba(255,255,255,0.5)
    color #666

    *
      width 100%
      height 100%

  .text
    margin 0 5px
    color #000
    font-size 20px
    user-select none

a
  color #000
  text-decoration none
  font-size 20px
  user-select none
</style>
