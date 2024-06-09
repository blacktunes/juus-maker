<template>
  <div
    v-if="currentJUUs"
    class="juus"
  >
    <div class="juus-wrapper">
      <Background
        :img="currentJUUs.bg"
        :type="2"
      />
      <div class="image">
        <img
          src="@/assets/images/logo.jpg"
          class="logo"
        />
        <div class="img-wrapper">
          <img
            :src="currentJUUs.img"
            class="img"
            @click="changeImg"
            :title="tip.img"
          />
        </div>
        <div class="icon-left">
          <img
            :src="likeImg"
            class="icon like"
            @click="setLike"
          />
          <img
            src="@/assets/images/message.png"
            class="icon"
          />
        </div>
        <div class="icon-right">
          <img
            src="@/assets/images/纸飞机.png"
            class="icon"
          />
        </div>
        <div class="text text-left">
          <span
            contenteditable
            @keydown.enter.prevent=""
          >
            {{ currentJUUs.like.text }}
          </span>
          次赞
        </div>
        <div
          class="text text-right"
          contenteditable
          @keydown.enter.prevent=""
        >
          {{ currentJUUs.time }}
        </div>
      </div>
      <Content />
    </div>
    <div
      v-show="!setting.screenshot"
      class="back"
      @click="back"
    >
      <img src="@/assets/images/back.png" />
      <span>返回</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import like from '@/assets/images/like.png'
import like_2 from '@/assets/images/like_2.png'
import Background from '@/components/JUUs/Background.vue'
import Content from '@/components/JUUs/Content.vue'
import { currentJUUs } from '@/store/data'
import { select } from '@/store/select'
import { setting, tip } from '@/store/setting'
import { computed } from 'vue'

const changeImg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        if (!currentJUUs.value) return
        currentJUUs.value.img = (e.target?.result as string) || ''
      }
    }
  }
  input.click()
}

const likeImg = computed(() => (currentJUUs.value?.like.flag ? like_2 : like))
const setLike = () => {
  if (!currentJUUs.value) return
  currentJUUs.value.like.flag = !currentJUUs.value.like.flag
}

const back = () => {
  select.show = false
  setting.juus.home = true
}
</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
