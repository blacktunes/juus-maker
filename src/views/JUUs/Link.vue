<template>
  <div class="link">
    <Transition
      name="menu"
      mode="out-in"
    >
      <div v-if="setting.juus.home || (!setting.juus.home && setting.screenshot)">
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
        <MenuBtn @click.stop="tip">
          <template #icon>
            <img
              src="../../assets/images/commander.webp"
              alt=""
            />
          </template>
          舰娘聊天
        </MenuBtn>
      </div>
      <div v-else-if="!setting.play">
        <MenuBtn @click.stop="$emit('screenshot')">
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
</template>

<script lang="ts" setup>
import { emitter } from '@/assets/scripts/event'
import { popupManager } from '@/assets/scripts/popup'
import { Bilibili, ChangeImage, Github, Image } from '@/components/Public/Icon'
import MenuBtn from '@/components/Public/MenuBtn.vue'
import { currentJUUs } from '@/store/juus'
import { setting } from '@/store/setting'

defineEmits(['screenshot'])

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

const tip = () => {
  popupManager.open('confirm', {
    text: [
      '<div style="width: 100%;height: 270px;display: flex;align-items: center;justify-content: center;font-size: 40px;">还没做完，鸽了</div>'
    ]
  })
}
</script>

<style lang="stylus" scoped>
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

.menu-enter-active
.menu-leave-active
  transition all 0.15s

.menu-enter-from
.menu-leave-to
  opacity 0
  transform scaleY(0)

.menu-enter-to
.menu-leave-from
  opacity 1
  transform scaleY(1)
</style>
