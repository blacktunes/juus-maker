<template>
  <Component
    :is="highlight ? Heart : HeartOutline"
    :class="{ highlight }"
  />
</template>

<script lang="ts" setup>
import { Heart, HeartOutline } from '@/components/Public/Icon'

defineProps<{
  highlight?: boolean
}>()
</script>

<style lang="stylus" scoped>
.highlight
  border-radius 50%
  filter drop-shadow(0px 0px 10px #ef5163)
  color #ef5163
</style>
