<template>
  <transition name="enter">
    <div
      class="main"
      v-show="ready"
    >
      <div
        class="mask"
        @click.stop="stopPlay"
        v-show="setting.play"
      ></div>
      <div class="talk-wrapper">
        <transition name="left">
          <TalkSelect v-show="data.home" />
        </transition>
        <transition name="right">
          <Talk
            ref="talkRef"
            v-if="!data.home"
          />
        </transition>
        <div class="menu">
          <template v-if="!data.home">
            <div
              class="btn"
              @click="screenshot"
            >
              <span>保存截图</span>
            </div>
            <span>·</span>
            <div
              class="btn"
              @click="autoPlay"
            >
              <span>自动播放</span>
            </div>
          </template>
        </div>
      </div>
      <transition name="slide">
        <div class="menu-wrapper">
          <ShipSelect
            class="select"
            :show-close="false"
          />
          <transition name="slide">
            <div
              class="menu-mask"
              v-show="data.home || setting.play"
            ></div>
          </transition>
          <div class="link">
            <a
              class="btn"
              href="https://github.com/blacktunes/juus-maker"
              target="_blank"
            >
              Github
            </a>
            <span>·</span>
            <a
              class="btn"
              href="https://space.bilibili.com/1384118"
              target="_blank"
            >
              Bilibili
            </a>
            <span>·</span>
            <a
              class="btn"
              href="/"
              target="_blank"
            >
              JUUs
            </a>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import ShipSelect from '@/components/Ship/ShipSelect.vue'
import { setting } from '@/store/setting'
import data, { getDB } from '@/store/talk'
import { ref, onMounted } from 'vue'
import Talk from './Talk.vue'
import TalkSelect from './TalkSelect.vue'

const talkRef = ref<InstanceType<typeof Talk> | null>(null)

const screenshot = () => {
  talkRef.value?.screenshot()
}

const autoPlay = () => {
  talkRef.value?.autoPlay()
}

const stopPlay = () => {
  talkRef.value?.stopPlay()
}

getDB()

const ready = ref(false)
onMounted(() => {
  ready.value = true
})
</script>

<style lang="stylus" scoped>
.main
  display flex
  height 100vh
  overflow scroll

  .menu-mask
    z-index 999
    display flex
    justify-content center
    align-items center
    position absolute
    width 100%
    height calc(100% - 30px)
    color #000
    font-size 20px
    font-weight bold
    background rgba(255, 255, 255, 0.6)
    backdrop-filter blur(5px)
    user-select none

  .menu-wrapper
    z-index 99
    position sticky
    top 0
    flex 1
    display flex
    flex-direction column
    height 100vh

    .select
      flex 1
      height 0
      background #f6fbff

    .link
      display flex
      height 30px
      width 100%
      align-items center
      justify-content center
      background #ddd

      a, span
        color #666
        font-size 16px
        user-select none

      a
        text-decoration none

      span
        margin 0 10px

  .talk-wrapper
    display flex
    flex-direction column
    max-width 100vw
    min-height calc(100vh - 30px)
    background #eff7ff

    .menu
      display flex
      justify-content center
      align-items center
      height 30px
      width 100%
      background #ddd
      color #666

      .btn
        display flex
        align-items center
        font-size 12px
        user-select none
        cursor pointer

      span
        margin 0 5px

@media only screen and (min-width 400px)
  .talk-wrapper
    width 400px
    flex 0 0 400px

@media only screen and (max-width 400px)
  .talk-wrapper
    width 100vw
    flex 0 0 100vw

  .menu-wrapper
    min-width 100vw
</style>

<style lang="stylus">
::-webkit-scrollbar
  width 0
  height 0

.left-leave-active
  transition transform 0.3s

.left-enter-active
  position fixed
  transition transform 0.3s

.left-enter-from, .left-leave-to
  transform translate3d(-100%, 0, 0)

.right-enter-active
  position fixed
  transition transform 0.3s

.right-leave-active
  transition transform 0.3s

.right-enter-from, .right-leave-to
  transform translate3d(100%, 0, 0)
</style>
