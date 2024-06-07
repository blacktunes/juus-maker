<template>
  <Main
    :viewport="{
      width: 1280,
      height: 720,
      bottom: 50
    }"
  >
    <transition name="fade">
      <ShipSelect
        v-show="select.show"
        class="select"
      />
    </transition>
    <transition name="fade">
      <JUUsSelect v-show="data.home" />
    </transition>
    <transition name="fade">
      <JUUs v-show="!data.home" />
    </transition>
    <div class="link">
      <a
        class="icon"
        href="https://github.com/blacktunes/juus-maker"
        target="_blank"
      >
        Github
      </a>
      <span>·</span>
      <a
        class="icon"
        href="https://space.bilibili.com/1384118"
        target="_blank"
      >
        Bilibili
      </a>
      <span>·</span>
      <a
        class="icon"
        href="/talk"
        target="_blank"
      >
        舰娘聊天
      </a>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import JUUsSelect from './JUUsSelect.vue'
import JUUs from './JUUs.vue'
import data, { getDB } from '@/store/juus'
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { select } from '@/store/select'
import { Main } from 'star-rail-vue'

getDB()
</script>

<style lang="stylus" scoped>
.select
  position fixed
  top 40px
  left 115px
  width 650px
  height 640px

.link
  position fixed
  bottom -30px
  display flex
  justify-content center
  width 100%

  a
  span
    color #666
    font-size 20px
    user-select none

  a
    text-decoration none

  span
    margin 0 10px
</style>
