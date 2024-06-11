<template>
  <div class="logo">
    <Logo class="svg" />
    <span>{{ name }}</span>
  </div>
</template>

<script lang="ts" setup>
import { Logo } from '@/components/Common/Icon'

withDefaults(
  defineProps<{
    name?: string
  }>(),
  {
    name: 'JUUS'
  }
)
</script>

<style lang="stylus" scoped>
.logo
  display flex
  flex-direction column
  justify-content center
  align-items center
  user-select none
  color #fff

  .svg
    animation logo 1s infinite alternate

  span
    margin -25px 0 25px
    text-indent 20px
    letter-spacing 20px
    font-size 26px
    animation text 1s infinite alternate

@keyframes logo
  0%
    transform translateY(-40px) scaleX(1.3) scaleY(0.8)

  20%
    transform translateY(-40px) scaleX(1.1) scaleY(0.9)

  50%
    transform translateY(20px) scaleX(1.1) scaleY(0.9)

  100%
    transform translateY(0) scaleX(1) scaleY(1)

@keyframes text
  0%
    transform translateY(0)

  20%
    transform translateY(0)

  50%
    transform translateY(10px)

  100%
    transform translateY(0)
</style>
