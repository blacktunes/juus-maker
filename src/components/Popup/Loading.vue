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
import Logo from '../Public/Logo.vue'

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
</style>
