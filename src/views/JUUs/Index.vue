<template>
  <div class="app-bg">
    <img
      :src="bg"
      alt=""
    />
  </div>
  <Main
    :viewport="{
      width: 1280,
      height: 720,
      bottom: 60
    }"
  >
    <div
      class="main-content"
      ref="dom"
    >
      <div class="bg">
        <img :src="bg" />
      </div>
      <Transition name="fade">
        <Loading v-if="!ready" />
      </Transition>
      <transition name="fade">
        <ShipSelect
          v-if="select.show"
          class="select"
        />
      </transition>
      <JUUsSelect
        v-show="setting.juus.home"
        :list="JUUsList"
      />
      <JUUs v-show="!setting.juus.home && currentJUUs" />
    </div>
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
        <div v-else>
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
              <Image />
            </template>
            更换背景
          </MenuBtn>
        </div>
      </Transition>
    </div>
  </Main>
</template>

<script lang="ts" setup>
import { loadJUUsDatabase } from '@/assets/scripts/database'
import { screenshot } from '@/assets/scripts/screenshot'
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { Bilibili, Github, Image } from '@/components/common/Icon'
import MenuBtn from '@/components/common/MenuBtn.vue'
import { currentJUUs, data, defaultBg } from '@/store/data'
import { select } from '@/store/select'
import { setting } from '@/store/setting'
import { Main } from 'star-rail-vue'
import JUUs from './JUUs.vue'
import JUUsSelect from './JUUsSelect.vue'
import Loading from './Loading.vue'
import { emitter } from '@/assets/scripts/event'

const ready = ref(false)

loadJUUsDatabase().then(() => {
  setTimeout(() => (ready.value = true), 1000)
})

const JUUsList = computed(() => {
  let list = data.juus
  list.sort((a, b) => b.time - a.time)
  return list
})

const bg = computed(() => {
  if (currentJUUs.value) return currentJUUs.value.bg
  if (data.juus[setting.juus.lastID]?.bg) return data.juus[setting.juus.lastID].bg
  if (JUUsList.value[0]?.bg) return JUUsList.value[0].bg
  return defaultBg
})

const changeBg = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = () => {
    if (input.files?.[0]) {
      const file = new FileReader()
      file.readAsDataURL(input.files[0])
      file.onload = (e) => {
        if (!currentJUUs.value) return
        currentJUUs.value.bg = (e.target?.result as string) || ''
      }
    }
  }
  input.click()
}

const dom = ref<HTMLElement | null>(null)
const saveJUUs = () => {
  if (dom.value) {
    screenshot(dom.value)
  }
}
</script>

<style lang="stylus" scoped>
.main-content
  position relative
  width 1280px
  height 720px

.app-bg
  position fixed
  z-index -1
  width 100vw
  height 100vh

  img
    width 100%
    height 100%
    filter blur(99px)
    object-fit cover

.bg
  position absolute
  top 0
  left 0
  z-index -1
  z-index 1
  width 100%
  height 100%
  filter blur(10px)
  user-select none

  img
    position absolute
    top 0
    left 50%
    height 100%
    transform translateX(-50%)

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

  div
    display flex
    justify-content center
    align-items flex-end
    overflow hidden

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
