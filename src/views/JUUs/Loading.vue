<template>
  <Transition name="fade">
    <div
      class="loading"
      v-if="!setting.ready"
    >
      <div class="loading-window">
        <Logo />
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import Logo from '@/components/Public/Logo.vue'
import { setting } from '@/store/setting'
</script>

<style lang="stylus" scoped>
.loading
  position absolute
  z-index 9
  display flex
  justify-content center
  align-items center
  width 100%
  height 100%

  .loading-window
    display flex
    flex-direction column
    justify-content center
    align-items center
    width 1050px
    height 640px
    border-radius 10px
    background rgba(0, 0, 0, 0.8)
    background-image radial-gradient(rgba(255, 255, 255, 0.01) 30%, transparent 0)
    background-size 8px 8px
    box-shadow 3px 3px 5px rgba(0, 0, 0, 0.5), -3px -3px 5px rgba(0, 0, 0, 0.5)
    backdrop-filter blur(30px)
</style>
