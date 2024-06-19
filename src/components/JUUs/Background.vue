<template>
  <div
    class="bg"
    :class="[`bg-${type}`]"
  >
    <img :src="img" />
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    img: string
    type?: 0 | 1 | 2
  }>(),
  {
    type: 0
  }
)
</script>

<style lang="stylus" scoped>
img()
  img
    width 200%
    height 200%
    filter blur(30px)
    object-fit cover

bg()
  &:after
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    background-size 8px 8px
    content ''

.bg-0
  img
    width 100%
    height 100%
    filter blur(10px)
    object-fit contain

.bg-1
  img()
  bg()

  &:after
    background-image radial-gradient(rgba(255, 255, 255, 0.1) 30%, transparent 0)
    mask-image radial-gradient(ellipse at 40% 50%, #000 40%, transparent 75%)

.bg-2
  img()
  bg()

  &:after
    background-image radial-gradient(rgba(255, 255, 255, 0.05) 30%, transparent 0)
    mask-image radial-gradient(ellipse at 40% 50%, #000 40%, transparent 65%)

.bg
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index -1
  display flex
  justify-content center
  align-items center
  overflow hidden
  pointer-events none
  user-select none
</style>
