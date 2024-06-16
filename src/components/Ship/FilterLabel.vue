<template>
  <div class="filter-label">
    <div class="header-bg-1"></div>
    <div class="header-bg-2"></div>
    <div class="title-text">
      <span>{{ title }}</span>
      <span>{{ subTitle }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string
  subTitle: string
}>()
</script>

<style lang="stylus" scoped>
.filter-label
  position relative
  position sticky
  top 0
  z-index 2
  display flex
  flex-shrink 0
  align-items center
  box-sizing border-box
  margin-bottom 5px
  padding 2px 8px
  width 100%
  height 40px
  user-select none

  &:after
    position absolute
    bottom 5px
    left 0
    z-index 3
    width 25%
    height 60%
    background linear-gradient(-45deg, rgba(0, 0, 0, 0.05) 0, rgba(0, 0, 0, 0.05) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.05) 75%, transparent 75%, transparent)
    background-size 15px 15px
    content ''

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
    gap 2px

    span
      &:nth-child(1)
        font-size 24px
        font-family 'Noto Serif SC', serif

      &:nth-child(2)
        margin-bottom 2px
        font-size 10px
        font-family 'Oxygen', sans-serif
</style>
