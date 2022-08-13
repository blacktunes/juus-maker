<template>
  <RouterView />
</template>

<script setup></script>

<style lang="stylus">
body
  margin 0

img
  -webkit-user-drag none

::-webkit-input-placeholder
  color #dfdfdf

@keyframes fade
  from
    opacity 0

  to
    opacity 1

.fade-enter-active, .fade-leave-active
  transition all 0.3s

.fade-enter-from, .fade-leave-to
  opacity 0

.fade-enter-to, .fade-leave-from
  opacity 1

.enter-enter-active, .enter-leave-active
  transition all 1s

.enter-enter-from, .enter-leave-to
  filter blur(50px)

.enter-enter-to, .enter-leave-from
  filter none
</style>
