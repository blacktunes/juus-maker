<template>
  <div class="juus" ref="juus">
    <div class="bg" @click="changeBg" :title="tip.bg">
      <img :src="data.list[data.index].bg" />
    </div>
    <div class="juus-wrapper">
      <div class="image">
        <img src="@/assets/images/logo.jpg" class="logo" />
        <div class="img-wrapper">
          <img
            :src="data.list[data.index].img"
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
            {{ data.list[data.index].like.text }}
          </span>
          次赞
        </div>
        <div class="text text-right" contenteditable @keydown.enter.prevent="">
          {{ data.list[data.index].time }}
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
      <div v-show="!select.show" class="back" @click="back">
        <img src="@/assets/images/back.png" />
        <span>返回</span>
      </div>
    </div>
  </div>
  <transition name="fade">
    <SelectView v-show="select.show" />
  </transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import Content from '@/components/Content.vue'
import SelectView from '@/components/SelectView.vue'
import { getData } from '@/assets/scripts/ship'
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
        data.list[data.index].bg = e.target.result
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
        data.list[data.index].img = e.target.result
      }
    }
  }
  input.click()
}

const likeImg = computed(() => data.list[data.index].like.flag ? require('@/assets/images/like_2.png') : require('@/assets/images/like.png'))
const setLike = () => {
  data.list[data.index].like.flag = !data.list[data.index].like.flag
}

const back = () => {
  data.home = true
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
data.list[data.index].juus = getData('塔什干', '北方联合的兔兔，超凶，嘎哦！')
data.list[data.index].comment.push({
  ...getData('U-110', '嘎哦！~'),
  reply: []
})
data.list[data.index].comment?.[0].reply.push(getData('塔什干', '嘎哦！！'))
</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
