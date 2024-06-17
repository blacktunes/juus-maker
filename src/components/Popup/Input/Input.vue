<template>
  <Popup
    :index="index"
    transition="fade"
  >
    <window
      :title="data.title"
      :sub-title="data.subTitle"
      width="45%"
      confirm
      @close="close"
    >
      <div class="input-wrapper">
        <span
          v-if="data.tip"
          class="tip"
          >{{ data.tip }}:</span
        >
        <div class="input">
          <textarea
            v-if="data.textarea"
            ref="inputDom"
            v-model="data.text"
            @keydown.enter.stop="onTextareaEnter"
          ></textarea>

          <input
            v-else
            type="text"
            ref="inputDom"
            v-model="data.text"
            @keydown.enter.prevent.stop="onConfirmlClick"
          />
        </div>
      </div>
      <template #footer>
        <WindowBtn
          :type="2"
          @click="close"
          >取消
        </WindowBtn>
        <WindowBtn
          name="确认"
          :type="data.required && (!data.fn || data.text.length < 1) ? 1 : 3"
          @click="onConfirmlClick"
          >确定</WindowBtn
        >
      </template>
    </window>
  </Popup>
</template>

<script lang="ts" setup>
import Window from '@/components/Public/Window.vue'
import WindowBtn from '@/components/Public/WindowBtn.vue'
import { Popup } from 'star-rail-vue'
import { callback, data } from './data'

const inputDom = ref<HTMLInputElement | null>(null)

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

watch(
  () => props.index,
  () => {
    if (props.index !== -1) {
      nextTick(() => {
        inputDom.value?.focus()
      })
    }
  }
)

const onTextareaEnter = (e: KeyboardEvent) => {
  if (data.textarea && e.ctrlKey) onConfirmlClick()
}

const onConfirmlClick = () => {
  if (data.required && data.text.length < 1) return false

  data.fn?.(data.text || '')
  close()
  return true
}

callback.confirm = onConfirmlClick
</script>

<style lang="stylus" scoped>
.input-wrapper
  display flex
  flex-direction column
  padding 20px 40px 30px 40px
  gap 10px

  .tip
    color #fff
    font-size 26px
    font-family 'Noto Serif SC', serif

  .input
    position relative

    &:before
      position absolute
      top -5px
      right -5px
      bottom -5px
      left -5px
      border 1px solid rgba(255, 255, 255, 0.1)
      content ''
      pointer-events none

  input
  textarea
    box-sizing border-box
    padding 5px 10px
    width 100%
    outline none
    border none
    background #212431
    color #fff
    font-size 24px

  input
    height 40px
    text-align center

  textarea
    height 150px
    resize none
</style>
