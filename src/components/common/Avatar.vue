<template>
  <div
    class="avatar"
    :class="{ highlight }"
    :style="{ width: `${width}px`, height: `${width}px` }"
  >
    <div :class="[`border-${type}`]">
      <img v-if="src" :src="src" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  highlight: {
    type: Boolean,
    default: false
  },
  src: {
    type: String,
    default: ''
  },
  type: {
    type: Number,
    default: 1
  },
  width: {
    type: Number,
    default: 45
  }
})
</script>

<style lang="stylus" scoped>
.avatar
  flex-shrink 0
  position relative
  cursor pointer

  div
    box-sizing border-box
    overflow hidden
    background #ddd
    border-radius 50%
    height 100%

    img
      width 100%
      height 100%
      object-fit cover
      object-position center
      user-select none

.highlight
  &:after
    content ''
    position absolute
    box-sizing border-box
    top -5px
    left -5px
    width calc(100% + 10px)
    height calc(100% + 10px)
    border-radius 50%
    border 2px solid #333
    animation fade 0.8s linear infinite alternate

.border-1
  border 1px solid #dedddb

.border-2
  border 2px solid #f7e5a2
</style>
