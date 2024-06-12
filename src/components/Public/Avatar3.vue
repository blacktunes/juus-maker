<template>
  <div
    class="avatar"
    :class="[highlight ? 'highlight' : undefined, `border-${type}`]"
    :style="{ width: `${width}px`, height: `${width}px` }"
  >
    <div>
      <img
        v-if="img"
        :src="img"
      />
      <div
        v-else
        style="background: #ddd"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(
  defineProps<{
    img?: string
    highlight?: boolean
    width?: number
    type?: 1 | 2
  }>(),
  {
    highlight: false,
    width: 45,
    type: 1
  }
)
</script>

<style lang="stylus" scoped>
.border-1
  background linear-gradient(0deg, #ab8748, #dbcd8e 30%, #fffabf)

.border-2
  background #a0a2ab

.avatar
  position relative
  flex-shrink 0
  border-radius 50%
  cursor pointer

  div
    overflow hidden
    box-sizing border-box
    margin 2px
    padding 2px
    width calc(100% - 4px)
    height calc(100% - 4px)
    border-radius 50%
    background #eee

    img
      width 100%
      height 100%
      border-radius 50%
      user-select none
      object-fit cover
      object-position center

.highlight
  &:after
    position absolute
    top -5px
    left -5px
    box-sizing border-box
    width calc(100% + 10px)
    height calc(100% + 10px)
    border 2px solid #333
    border-radius 50%
    content ''
    animation fade 0.8s linear infinite alternate

@keyframes fade
  from
    opacity 0

  to
    opacity 1
</style>
