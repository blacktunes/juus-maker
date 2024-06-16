<template>
  <div class="global-bg">
    <img :src="currentBg" />
  </div>
  <Main
    :viewport="{
      width: 1280,
      height: 720,
      bottom: 60
    }"
    :popup="popupManager"
  >
    <div
      class="main"
      ref="dom"
    >
      <Background :img="currentBg" />
      <JUUsSelect :ready />
      <JUUs @screenshot="saveJUUs" />
      <Loading :show="!ready" />
    </div>
    <ShipSelect class="select" />
    <Mask />
    <Link @screenshot="saveJUUs" />
  </Main>
</template>

<script lang="ts" setup>
import { loadJUUsDatabase } from '@/assets/scripts/database'
import { popupManager } from '@/assets/scripts/popup'
import { screenshot } from '@/assets/scripts/screenshot'
import Background from '@/components/JUUs/Background.vue'
import Mask from '@/components/Public/Mask.vue'
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { Main } from 'star-rail-vue'
import { currentBg } from './JUUs'
import JUUs from './JUUs.vue'
import JUUsSelect from './JUUsSelect.vue'
import Link from './Link.vue'
import Loading from './Loading.vue'

const ready = ref(false)

loadJUUsDatabase().then(() => {
  nextTick(() => (ready.value = true))
})

const dom = ref<HTMLElement | null>(null)
const saveJUUs = () => {
  if (dom.value) {
    screenshot(dom.value)
  }
}
</script>

<style lang="stylus" scoped>
.main
  position relative
  width 1280px
  height 720px
  box-shadow 0 0 10px 5px rgba(0, 0, 0, 0.2)
  border-radius 10px
  margin-top 10px 

.global-bg
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index -1

  img
    width 100%
    height 100%
    filter blur(99px)
    object-fit cover

.select
  position fixed
  top 40px
  left 115px
  width 650px
  height 640px
</style>
