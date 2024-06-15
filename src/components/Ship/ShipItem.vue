<template>
  <div
    class="ship-item"
    :class="{ highlight }"
  >
    <div class="avatar">
      <img
        v-if="item.avatar"
        :src="item.avatar"
      />
      <img
        class="outline"
        v-if="item.data.param2"
        :src="outline[item.data.param2]"
      />
    </div>
    <div>
      <div class="name">{{ item.name }}</div>
      <div class="alias">{{ item.nickname || item.alias || item.name }}</div>
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  highlight?: boolean
  item: ShipData<any>
}>()

const outline = {
  普通: 'https://patchwiki.biligame.com/images/blhx/thumb/1/15/pxho13xsnkyb546tftvh49etzdh74cf.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E6%99%AE%E9%80%9A.png',
  稀有: 'https://patchwiki.biligame.com/images/blhx/thumb/a/a9/k8t7nx6c8pan5vyr8z21txp45jxeo66.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E7%A8%80%E6%9C%89.png',
  精锐: 'https://patchwiki.biligame.com/images/blhx/thumb/a/a5/5whkzvt200zwhhx0h0iz9qo1kldnidj.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E7%B2%BE%E9%94%90.png',
  超稀有:
    'https://patchwiki.biligame.com/images/blhx/thumb/a/a2/ptog1j220x5q02hytpwc8al7f229qk9.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E8%B6%85%E7%A8%80%E6%9C%89.png',
  海上传奇:
    'https://patchwiki.biligame.com/images/blhx/thumb/6/6d/qqv5oy3xs40d3055cco6bsm0j4k4gzk.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E6%B5%B7%E4%B8%8A%E4%BC%A0%E5%A5%87.png',
  最高方案:
    'https://patchwiki.biligame.com/images/blhx/thumb/6/6a/9vt4djm7me8mwmjczrynb01x270jy12.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E6%9C%80%E9%AB%98%E6%96%B9%E6%A1%88.png',
  决战方案:
    'https://patchwiki.biligame.com/images/blhx/thumb/e/ef/ibj3a3mauy8nrdsjfxncb7v7r7hnfq6.png/90px-%E8%88%B0%E5%A8%98%E5%A4%B4%E5%83%8F%E5%A4%96%E6%A1%86%E5%86%B3%E6%88%98%E6%96%B9%E6%A1%88.png'
}
</script>

<style lang="stylus" scoped>
.ship-item
  position relative
  display flex
  align-items center
  box-sizing border-box
  margin 5px
  padding 10px
  height 70px
  border 1px solid #ddd
  border-radius 10px
  background #fff
  user-select none

  &:hover
    background rgb(240, 240, 240)

  .name
    display flex
    flex 1
    align-items center
    font-weight bolder
    font-size 20px

    span
      flex-shrink 0

  .avatar
    position relative
    flex-shrink 0
    margin-right 10px
    width 45px
    height 45px
    background #ddd

    img
      width 100%
      height 100%
      user-select none
      object-fit cover
      object-position center

    .outline
      position absolute
      top 0
      right 0
      bottom 0
      left 0

  .alias
    font-size 14px

.highlight
  background #87cefa !important

  .name
  .alias
    color #fff !important
    text-shadow 1px 1px 3px rgba(0, 0, 0, 0.5)
</style>
