<template>
  <div class="global-bg">
    <img :src="currentBg" />
  </div>
  <Main
    :viewport="{
      width: 1280,
      height: 720,
      bottom: 60
    }"
    :popup="popupManager"
  >
    <div
      class="main"
      ref="dom"
    >
      <Background :img="currentBg" />
      <div
        class="mask"
        v-if="setting.play"
      ></div>
      <Transition name="fade">
        <Loading v-if="!ready" />
      </Transition>
      <transition name="select">
        <ShipSelect
          v-if="select.show"
          class="select"
        />
      </transition>
      <Transition
        name="select"
        appear
      >
        <JUUsSelect
          v-show="ready && setting.juus.home"
          :list="JUUsList"
        />
      </Transition>
      <JUUs v-show="!setting.juus.home && currentJUUs" />
    </div>
    <Mask />
    <div class="link">
      <Transition
        name="menu"
        mode="out-in"
      >
        <div v-if="setting.juus.home">
          <MenuBtn href="https://github.com/blacktunes/juus-maker">
            <template #icon>
              <Github />
            </template>
            Github
          </MenuBtn>
          <MenuBtn href="https://space.bilibili.com/1384118">
            <template #icon>
              <Bilibili />
            </template>
            Bilibili
          </MenuBtn>
          <MenuBtn href="/talk">
            <template #icon>
              <img
                src="../../assets/images/commander.jpg"
                alt=""
              />
            </template>
            舰娘聊天
          </MenuBtn>
        </div>
        <div v-else-if="!setting.play">
          <MenuBtn @click.stop="saveJUUs">
            <template #icon>
              <Image />
            </template>
            保存动态
          </MenuBtn>
          <MenuBtn @click.stop="emitter.emit('screenshot')">
            <template #icon>
              <Image />
            </template>
            保存对话
          </MenuBtn>
          <MenuBtn @click.stop="emitter.emit('play')">
            <template #icon>
              <Image />
            </template>
            自动播放
          </MenuBtn>
          <MenuBtn @click.stop="changeBg">
            <template #icon>
              <ChangeImage style="width: 22px" />
            </template>
            更换背景
          </MenuBtn>
        </div>
        <div v-else>
          <MenuBtn @click.stop="emitter.emit('stop')">
            <template #icon>
              <Image />
            </template>
            停止播放
          </MenuBtn>
        </div>
      </Transition>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import { loadJUUsDatabase } from '@/assets/scripts/database'
import { emitter } from '@/assets/scripts/event'
import { popupManager } from '@/assets/scripts/popup'
import { screenshot } from '@/assets/scripts/screenshot'
import { Bilibili, ChangeImage, Github, Image } from '@/components/Public/Icon'
import Mask from '@/components/Public/Mask.vue'
import MenuBtn from '@/components/Public/MenuBtn.vue'
import Background from '@/components/JUUs/Background.vue'
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { currentJUUs } from '@/store/data'
import { select } from '@/store/select'
import { setting } from '@/store/setting'
import { Main } from 'star-rail-vue'
import { JUUsList, currentBg } from './JUUs'
import JUUs from './JUUs.vue'
import JUUsSelect from './JUUsSelect.vue'
import Loading from './Loading.vue'

const ready = ref(false)

loadJUUsDatabase().then(() => {
  setTimeout(() => (ready.value = true), 1000)
})

const changeBg = () => {
  popupManager
    .open('cropper', {
      aspectRatio: 1.7,
      maxWidth: 1280
    })
    .then((res) => {
      if (!currentJUUs.value) return
      currentJUUs.value.bg = res.base64
    })
}

const dom = ref<HTMLElement | null>(null)
const saveJUUs = () => {
  if (dom.value) {
    screenshot(dom.value)
  }
}
</script>

<style lang="stylus" scoped>
.main
  position relative
  width 1280px
  height 720px

.global-bg
  position fixed
  top 0
  right 0
  bottom 0
  left 0
  z-index -1

  img
    width 100%
    height 100%
    filter blur(99px)
    object-fit cover

.bg
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index -1
  filter blur(10px)
  user-select none

  img
    position absolute
    top 0
    left 50%
    height 100%
    transform translateX(-50%)

.mask
  position absolute
  top 0
  right 0
  bottom 0
  left 0
  z-index 9
  user-select none

.select
  position fixed
  top 40px
  left 115px
  width 650px
  height 640px

.link
  position fixed
  bottom -50px
  z-index 1
  display flex
  justify-content center
  align-items flex-end
  box-sizing border-box
  width 100%
  height 50px
  gap 5px

  & > div
    display flex
    justify-content center
    align-items flex-end
    overflow hidden

.select-enter-active
.select-leave-active
  transition all 0.3s

.select-enter-from
  opacity 0
  transform translateY(20px)

.select-enter-to
  opacity 1
  transform translateY(0)

.select-leave-from
  opacity 1

.select-leave-to
  opacity 0

.menu-enter-active
.menu-leave-active
  transition all 0.3s

.menu-enter-from
.menu-leave-to
  max-height 0

.menu-enter-to
.menu-leave-from
  max-height 100%
</style>
