<template>
  <transition name="enter">
    <div
      class="main"
      :style="{ width: realWidth, height: realHeight }"
      v-if="ready"
    >
      <div
        class="wrapper"
        :style="{
          transform: `scale(${scale})`,
          width: `${width}px`,
          height: `${height}px`,
        }"
      >
        <JUUs />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import JUUs from '@/views/JUUs.vue'

const width = 1280
const height = 720
const scale = ref(1)
const realWidth = computed(() => `${width * scale.value}px`)
const realHeight = computed(() => `${height * scale.value}px`)

const setSize = () => {
  const h = window.innerWidth / width
  const v = window.innerHeight / height
  scale.value = Math.min(h, v)
}
setSize()

window.onresize = () => {
  setSize()
}

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

  .wrapper
    transform-origin left top
    background #fff
    display flex
    justify-content center
    align-items center
</style>

<style lang="stylus">
body
  margin 0

img
  -webkit-user-drag none

.enter-enter-active, .enter-leave-active
  transition all 1s

.enter-enter-from, .enter-leave-to
  filter blur(50px)

.enter-enter-to, .enter-leave-from
  filter none
</style>
