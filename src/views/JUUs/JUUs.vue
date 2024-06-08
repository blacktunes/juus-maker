<template>
  <div
    v-if="currentJUUs"
    class="juus"
    ref="juus"
  >
    <div
      class="mask"
      @click.stop="stopPlay"
      v-show="setting.play"
    ></div>
    <!-- <div
      class="bg"
      @click="changeBg"
      :title="tip.bg"
    >
      <img :src="currentJUUs.bg" />
    </div> -->
    <div class="juus-wrapper">
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
        <div
          v-show="!select.show"
          class="menu menu-icon save-all"
          :class="{ hide: setting.screenshot }"
          @click="screenshot(false)"
          :title="tip.screenshot"
        >
          <img src="@/assets/images/save.png" />
        </div>
      </div>
      <Content
        class="content-wrapper"
        :screenshot="setting.screenshot"
        ref="content"
      />
      <div
        v-show="!select.show"
        class="menu save-right"
        :class="{ hide: setting.screenshot }"
      >
        <div
          class="menu-icon"
          @click="screenshot(true)"
          :title="tip.screenshotTalk"
        >
          <img src="@/assets/images/save.png" />
        </div>
        <div
          class="menu-icon"
          style="margin-top: 6px"
          @click="autoPlay"
        >
          <img src="@/assets/images/play.png" />
        </div>
      </div>
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
import commander from '@/assets/images/commander.jpg'
import like from '@/assets/images/like.png'
import like_2 from '@/assets/images/like_2.png'
import _screenshot from '@/assets/scripts/screenshot'
import Content from '@/components/JUUs/Content.vue'
import { currentJUUs } from '@/store/data'
import input from '@/store/input'
import { select } from '@/store/select'
import { setting, tip } from '@/store/setting'
import { computed, ref } from 'vue'

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

const juus = ref<HTMLElement | null>(null)
const content = ref<InstanceType<typeof Content> | null>(null)
const screenshot = (flag?: boolean) => {
  select.type = 0
  input.key = '指挥官'
  input.avatar = commander
  input.name = '指挥官'
  if (flag) {
    if (content.value?.dom) {
      _screenshot(content.value.dom, content.value.dom.offsetWidth, content.value.dom.scrollHeight)
    }
  } else {
    if (juus.value) _screenshot(juus.value)
  }
}

const autoPlay = () => {
  content.value?.autoPlay()
}

const stopPlay = () => {
  content.value?.stopPlay()
}

defineExpose({ screenshot })
</script>

<style lang="stylus" src="./JUUs.styl" scoped></style>
