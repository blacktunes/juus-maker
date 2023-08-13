<template>
  <transition name="fade">
    <div
      v-if="setting.screenshot"
      class="loading"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="50"
        height="50"
        viewBox="0 0 400 400"
      >
        <circle
          class="circle"
          cx="200"
          cy="200"
          r="180"
          stroke="#ddd"
          stroke-width="40"
          stroke-linecap="round"
          stroke-dasharray="1194"
          fill="none"
        />
      </svg>
    </div>
  </transition>
  <RouterView />
</template>

<script lang="ts" setup>
import { getDB } from './store/custom'
import { setting } from '@/store/setting'

getDB()
</script>
<style lang="stylus" scoped>
.loading
  z-index 999
  position absolute
  width 100%
  height 100%
  background rgba(0, 0, 0, 0.5)
  display flex
  justify-content center
  align-items center

  .circle
    stroke-dashoffset 0
    animation loading 2s infinite
    transform-origin center

@keyframes loading
  0%
    stroke-dashoffset 0
    transform rotate(0deg)

  50%
    stroke-dashoffset 1194

  100%
    stroke-dashoffset 0
    transform rotate(360deg)
</style>
