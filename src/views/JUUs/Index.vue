<template>
  <transition name="enter">
    <div class="main" v-show="ready">
      <div
        class="wrapper"
        :style="{
          transform: `scale(${scale})`,
          width: `${width}px`,
          height: `${height}px`
        }"
      >
        <transition name="fade">
          <JUUsSelect v-show="data.home" />
        </transition>
        <transition name="fade">
          <JUUs v-show="!data.home" />
        </transition>
      </div>
    </div>
  </transition>
  <div class="info">
    <a
      class="icon"
      href="https://github.com/blacktunes/juus-maker"
      target="_blank"
    >
      <img src="@/assets/images/github.png" />
    </a>
    <a class="icon" href="https://space.bilibili.com/1384118" target="_blank">
      <img src="@/assets/images/bilibili.png" />
    </a>
    <a class="icon" href="/talk" target="_blank">
      <img src="@/assets/images/commander.png" />
    </a>
    <div class="tip">
      <img src="@/assets/images/info.png" />
    </div>
  </div>
  <transition name="fade">
    <div
      class="horizontal"
      v-if="horizontalTip && shouldHorizontal"
      @click="horizontalTip = false"
    >
      <div class="bg"></div>
      <div class="item">
        <div class="img">
          <img src="@/assets/images/horizontal.png" />
        </div>
        <div>推荐横屏使用</div>
        <div style="font-size: 10px">(点击屏幕关闭提示)</div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import JUUsSelect from './JUUsSelect.vue'
import JUUs from './JUUs.vue'
import data, { getDB } from '@/store/juus'

const width = 1280
const height = 720
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${height * scale.value}px`)
const infoScale = computed(() => `scale(${Math.min(1, h.value)}) translateY(-115px)`)
const infoHoverScale = computed(() => `scale(${Math.min(1, h.value)}) translateY(0)`)

const h = ref(1)
const v = ref(1)
const windowWidth = ref(width)

const setSize = () => {
  windowWidth.value = window.innerWidth
  h.value = window.innerWidth / width
  v.value = window.innerHeight / height
  scale.value = Math.min(h.value, v.value)
}
setSize()

const horizontalTip = ref(true)
const shouldHorizontal = computed(() => windowWidth.value <= 550 && v.value > h.value)

window.onresize = () => {
  setSize()
}

getDB()

const ready = ref(false)
onMounted(() => {
  ready.value = true
})
</script>

<style lang="stylus" scoped>
.main
  overflow hidden
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  margin auto
  width v-bind(realWidth)
  height v-bind(realHeight)

  .wrapper
    background #fff
    display flex
    justify-content center
    align-items center
    transform-origin left top

.info
  z-index 999
  top 0
  right 0
  position fixed
  display flex
  flex-direction column
  align-items center
  justify-content center
  width 35px
  background #fff
  border-bottom-left-radius 10px
  padding 5px 5px 0 5px
  border 1px solid #ddd
  border-top none
  border-right none
  transition all 0.3s
  transform v-bind(infoScale)
  transform-origin top right
  user-select none

  &:hover
    padding 5px
    transform v-bind(infoHoverScale)

    .tip
      opacity 0
      margin-top 0
      height 0

  .icon
    display flex
    width 100%

    img
      width 100%

  .tip
    overflow hidden
    opacity 1
    margin-top 5px
    height 35px
    transition all 0.3s

    img
      height 100%

.horizontal
  position fixed
  top 0
  left 0
  width 100vw
  height 100vh
  display flex
  justify-content center
  align-items center

  .bg
    z-index 5
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    background rgba(255, 255, 255, 0.8)

  .item
    z-index 9
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 100%
    color #8a8a8a
    user-select none

    .img
      width 25%

      img
        width 100%
</style>
