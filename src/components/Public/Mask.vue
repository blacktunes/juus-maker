<template>
  <div
    class="popup-mask"
    v-if="show"
  >
    <div class="mask-bg"></div>
  </div>
</template>

<script lang="ts" setup>
import { popupManager } from '@/assets/scripts/popup'

const show = computed(() => {
  if (popupManager.popup.length === 1 && popupManager.currentComponent === 'cropper') return false
  return popupManager.hasPopup()
})
</script>

<style lang="stylus" scoped>
.popup-mask
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 9
  background-image url('@/assets/images/add.webp')
  background-position 30px 30px
  background-size 110px
  box-shadow 0 0 20px 0 rgba(0, 0, 0, 0.5)
  animation backdrop-filter 0.9s
  backdrop-filter blur(10px)
  -webkit-backdrop-filter blur(10px)

  .mask-bg
    position absolute
    top 0
    right 0
    bottom 0
    left 0
    background-image radial-gradient(rgba(255, 255, 255, 0.05) 50%, transparent 0)
    background-size 2px 2px

@keyframes backdrop-filter
  from
    backdrop-filter blur(0px)

  to
    backdrop-filter blur(10px)
</style>
