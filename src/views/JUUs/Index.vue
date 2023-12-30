<template>
  <transition name="enter">
    <div
      class="main"
      v-show="ready"
    >
      <div
        class="wrapper"
        :style="{
          transform: `scale(${scale})`,
          width: `${width}px`,
          height: `${height}px`
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
      </div>
    </div>
  </transition>
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
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { select } from '@/store/select'

// 计算窗口尺寸
const width = 1280
const height = 720
const bottom = 50
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${(height + bottom) * scale.value}px`)

const horizontalTip = ref(true)
const shouldHorizontal = ref(false)

const setSize = () => {
  shouldHorizontal.value = window.innerWidth <= 550 && window.innerWidth < window.innerHeight
  scale.value = Math.min(window.innerWidth / width, window.innerHeight / (height + bottom))
}
setSize()

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
  width 100%
  justify-content center

  a, span
    color #666
    font-size 20px
    user-select none

  a
    text-decoration none

  span
    margin 0 10px

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
