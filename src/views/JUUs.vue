<template>
  <div class="juus" ref="juus">
    <div class="bg" @click="changeBg" :title="tip.bg">
      <img :src="data.bg" />
    </div>
    <div class="juus-wrapper">
      <div class="image">
        <img src="@/assets/images/logo.jpg" class="logo" />
        <div class="img-wrapper">
          <img
            :src="data.img"
            class="img"
            @click="changeImg"
            :title="tip.img"
          />
        </div>
        <div class="icon-left">
          <img :src="likeImg" class="icon like" @click="setLike" />
          <img src="@/assets/images/message.png" class="icon" />
        </div>
        <div class="icon-right">
          <img src="@/assets/images/纸飞机.png" class="icon" />
        </div>
        <div class="text text-left">
          <span contenteditable @keydown.enter.prevent="">
            {{ data.like.text }}
          </span>
          次赞
        </div>
        <div class="text text-right" contenteditable @keydown.enter.prevent="">
          {{ data.time }}
        </div>
        <div
          v-show="!select.show"
          class="menu-icon save-all"
          :class="{ hide: isScreenshot }"
          @click="screenshot(false)"
          :title="tip.screenshot"
        >
          <img src="@/assets/images/save.png" />
        </div>
      </div>
      <Content
        class="content-wrapper"
        :isScreenshot="isScreenshot"
        ref="content"
      />
      <div
        v-show="!select.show"
        class="menu-icon save-right"
        :class="{ hide: isScreenshot }"
        @click="screenshot(true)"
        :title="tip.screenshotTalk"
      >
        <img src="@/assets/images/save.png" />
      </div>
    </div>
  </div>
  <SelectView v-if="select.show" />
</template>

<script setup>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import Content from '@/components/Content.vue'
import SelectView from '@/components/SelectView.vue'
import ship from '@/assets/scripts/ship'
import data from '@/store/data'
import tip from '@/store/tip'
import { select } from '@/store/input'

const changeBg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        data.bg = e.target.result
      }
    }
  }
  input.click()
}

const changeImg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        data.img = e.target.result
      }
    }
  }
  input.click()
}

const likeImg = computed(() => data.like.flag ? require('@/assets/images/like_2.png') : require('@/assets/images/like.png'))
const setLike = () => {
  data.like.flag = !data.like.flag
}

const isScreenshot = ref(false)
const juus = ref(null)
const content = ref(null)
const screenshot = (flag) => {
  isScreenshot.value = true
  domtoimage.toPng(flag ? content.value.dom : juus.value, {
    width: flag ? content.value.dom.offsetWidth : undefined,
    height: flag ? content.value.dom.scrollHeight : undefined,
    imagePlaceholder: require('@/assets/images/empty.png')
  })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `JUUs-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      // const img = new Image()
      // img.src = dataUrl
      // const win = window.open('')
      // win.document.body.appendChild(img)
    })
    .catch((error) => {
      console.error('截图保存错误', error)
    })
    .finally(() => {
      isScreenshot.value = false
    })
}

defineExpose({ screenshot })

// init
data.juus = { key: '塔什干', ...ship['塔什干'], text: '北方联合的兔兔，超凶，嘎哦！' }
data.comment.push({
  key: 'U-110',
  ...ship['U-110'],
  text: '嘎哦！~',
  reply: []
})
data.comment?.[0].reply.push({
  key: '塔什干',
  ...ship['塔什干'],
  text: '嘎哦！！'
})
</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
