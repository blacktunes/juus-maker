<template>
  <div
    class="avatar"
    :class="{ highlight }"
    :style="{ width: `${width}px`, height: `${width}px` }"
  >
    <div>
      <img
        v-if="img"
        :src="img"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    highlight?: boolean
    img?: string
    width?: number
  }>(),
  {
    width: 40
  }
)
</script>

<style lang="stylus" scoped>
.avatar
  position relative
  flex-shrink 0
  cursor pointer

  &:before
    position absolute
    top -3px
    right -3px
    bottom -3px
    left -3px
    box-sizing border-box
    border 1px solid #dedddb
    border-radius 50%
    content ''

  div
    overflow hidden
    box-sizing border-box
    height 100%
    border-radius 50%
    background #ddd

    img
      width 100%
      height 100%
      user-select none
      object-fit cover
      object-position center

.highlight
  &:after
    position absolute
    top -5px
    right -5px
    bottom -5px
    left -5px
    box-sizing border-box

    border 2px solid #333
    border-radius 50%
    content ''
    animation fade 0.8s linear infinite alternate
</style>
