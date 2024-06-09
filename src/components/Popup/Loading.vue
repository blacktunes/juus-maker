<template>
  <Teleport to="body">
    <div
      class="global-loaging"
      v-if="props.index !== -1"
      :style="{ zIndex: 10 + index }"
      @click.stop
    >
      <Logo
        :style="{
          transform: `scale(${scale ?? 1})`
        }"
      />
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import Logo from '../common/Logo.vue'

defineEmits<{
  (event: 'close', name: string): void
}>()

const scale = inject<ComputedRef<number> | undefined>('scale')

const props = defineProps<{
  name: string
  index: number
}>()
</script>

<style lang="stylus" scoped>
.global-loaging
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  display flex
  flex-direction column
  justify-content center
  align-items center
  background rgba(0, 0, 0, 0.1)
  background-image radial-gradient(rgba(255, 255, 255, 0.01) 30%, transparent 0)
  background-size 8px 8px
  backdrop-filter blur(5px)
</style>
