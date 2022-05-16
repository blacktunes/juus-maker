<template>
  <div class="menu">
    <div class="menu-icon" @click="screenshot(false)">
      <img src="@/assets/images/share.png" />
    </div>
    <div class="menu-icon" @click="screenshot(true)">
      <img src="@/assets/images/share.png" />
    </div>
    <div class="menu-icon" @click="changeBg">
      <img src="@/assets/images/img_icon.png" />
    </div>
  </div>
  <div ref="juus">
    <img :src="data.bg" class="bg" />
    <div class="juus-wrapper">
      <div class="image">
        <img src="@/assets/images/logo.jpg" class="logo" />
        <div class="img-wrapper">
          <img :src="data.img" class="img" @click="changeImg" />
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
      </div>
      <Content :isScreenshot="isScreenshot" ref="content" />
    </div>
  </div>
  <div class="select-wrapper"></div>
</template>

<script setup>
import { ref, computed } from 'vue'
import domtoimage from 'dom-to-image'
import Content from '@/components/Content.vue'
import ship from '@/assets/scripts/ship'
import data from '@/store/data'

const getData = (name) => {
  return ship[name]
    ? ship[name]
    : { avatar: '', name: '' }
}

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
    imagePlaceholder: require('@/assets/images/empty.png')
  })
    .then((dataUrl) => {
      const link = document.createElement('a')
      link.download = `JUUs-${Date.now()}.png`
      link.href = dataUrl
      link.click()
    })
    .catch((error) => {
      console.error('截图保存错误', error)
    })
    .finally(() => {
      isScreenshot.value = false
    })
}

// init
const 塔什干 = getData('塔什干')
const U110 = getData('U-110')
data.juus.avatar = 塔什干.avatar
data.juus.name = 塔什干.name
data.juus.text = '北方联合的兔兔，超凶，嘎哦！'
data.comment.push({
  avatar: U110.avatar,
  name: U110.name,
  text: '嘎哦！~',
  reply: []
})
data.comment?.[0].reply.push({
  avatar: 塔什干.avatar,
  name: 塔什干.name,
  text: '嘎哦！！'
})
</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
