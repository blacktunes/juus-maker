<template>
  <Popup
    :index="index"
    transition="fade"
  >
    <Window
      :title="data.title"
      width="45%"
      height="55%"
      confirm
      @close="close"
    >
      <div :class="[data.fn ? 'text' : 'tip']">
        <div
          v-for="(text, index) in data.text"
          :key="index"
          v-html="text"
        ></div>
      </div>
      <template
        #footer
        v-if="data.fn"
      >
        <WindowBtn @click="close">取消</WindowBtn>
        <WindowBtn
          :type="3"
          @click="onConfirml"
          >确定</WindowBtn
        >
      </template>
    </Window>
  </Popup>
</template>

<script lang="ts" setup>
import Window from '@/components/Public/Window.vue'
import { callback, data } from './data'
import { Popup } from 'star-rail-vue'
import WindowBtn from '@/components/Public/WindowBtn.vue'

const props = defineProps<{
  name: string
  index: number
}>()

const emits = defineEmits<{
  (event: 'close', name: string): void
}>()

const close = () => {
  emits('close', props.name)
}

const onConfirml = async () => {
  data.fn?.()
  close()
  return true
}

callback.confirm = onConfirml
</script>

<style lang="stylus" scoped>
.text
  display flex
  flex-direction column
  justify-content center
  align-items center
  width 100%
  height 100%
  color #fff
  text-indent 2px
  letter-spacing 2px
  font-weight lighter
  font-size 22px
  user-select none

.tip
  color #fff
</style>
