<template>
  <div class="select-view">
    <div class="scroll-view">
      <div class="item fixed">
        <div class="avatar">
          <img v-if="avatarData.avatar" :src="avatarData.avatar" />
        </div>
        <div class="name">{{ avatarData.key }} /<input v-model="avatarData.name" /></div>
      </div>
      <div
        v-for="(item, key) in ship"
        :key="item.name"
        class="item"
        :class="{ highlight: key === avatarData.key }"
        @click="change(key)"
      >
        <div class="avatar">
          <img v-if="item.avatar" :src="item.avatar" />
        </div>
        <div class="name">{{ key }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ship from '@/assets/scripts/ship'
import input, { select } from '@/store/input'
import data from '@/store/data'

const change = (name) => {
  avatarData.value.key = name
  avatarData.value.avatar = ship[name].avatar
  avatarData.value.name = ship[name].name
}

const avatarData = computed(() => {
  switch (select.type) {
    case 0:
      return input
    case 1:
      return data.juus
    case 2:
      return data.comment[select.index]
    case 3:
      return data.comment[select.index].reply[select.key]
    default:
      return input
  }
})
</script>

<style lang="stylus" scoped>
.select-view
  z-index 99
  position fixed
  top 40px
  left 115px
  width 628px
  height 600px
  background rgba(255, 255, 255, 0.7)
  padding 20px 10px
  border-radius 5px 0 0 5px

  .scroll-view
    height 100%
    overflow-y scroll
    display flex
    flex-wrap wrap
    justify-content flex-start

    &::-webkit-scrollbar
      width 10px
      height 10px

    &::-webkit-scrollbar-track
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.4)
      border-radius 4px

    &::-webkit-scrollbar-thumb
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
      border-radius 4px

    &::-webkit-scrollbar-thumb:active
      background-color #aaa

    .item
      display flex
      align-items center
      box-sizing border-box
      align-items center
      padding 10px 15px 10px 10px
      margin 5px
      user-select none
      border 1px solid #ddd
      border-radius 5px
      background #fff

      .avatar
        overflow hidden
        width 45px
        height 45px
        border 2px solid #dedddb
        margin-right 10px
        border-radius 50%
        background #ddd

        img
          width 100%
          user-select none

      .name
        flex 1
        font-size 20px
        font-weight bolder
        color #444

.fixed
  position sticky
  top 0
  margin-top 0 !important
  width 100%

  input
    font-size 20px
    font-weight bolder
    color #444
    padding 5px 10px
    border none
    width 240px

    &::-webkit-input-placeholder
      color #dfdfdf

.highlight
  background #a2a2a2 !important

  .name
    color #fff !important
</style>
