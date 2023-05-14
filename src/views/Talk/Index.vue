<template>
  <transition name="enter">
    <div class="main" v-show="ready">
      <div class="mask" @click.stop="stopPlay" v-show="setting.play"></div>
      <transition name="left">
        <TalkSelect class="talk-wrapper" v-show="data.home" />
      </transition>
      <transition name="right">
        <Talk class="talk-wrapper" ref="talkRef" v-if="!data.home" />
      </transition>
      <transition name="slide">
        <div v-show="!setting.play" class="menu-wrapper">
          <ShipSelect class="select" :show-close="false" />
          <transition name="slide">
            <div class="menu-mask" v-show="data.home">懒得想UI，先这样吧</div>
          </transition>
          <div class="menu">
            <div class="talk-menu" v-show="!data.home">
              <div
                class="icon"
                style="width: 30px; height: 30px"
                @click="screenshot"
              >
                <img src="@/assets/images/save.png" />
              </div>
              <div
                class="icon"
                style="width: 30px; height: 30px"
                @click="autoPlay"
              >
                <img src="@/assets/images/play.png" />
              </div>
              <div class="sep"></div>
            </div>
            <a class="icon" href="/" target="_blank">
              <img src="@/assets/images/commander.png" />
            </a>
            <a
              class="icon"
              style="
                border-radius: 50%;
                width: 30px;
                height: 30px;
                margin: 0 3px;
              "
              href="https://github.com/blacktunes/juus-maker"
              target="_blank"
            >
              <img src="@/assets/images/github.png" />
            </a>
            <a
              class="icon"
              href="https://space.bilibili.com/1384118"
              target="_blank"
            >
              <img src="@/assets/images/bilibili.png" />
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
    height calc(100% - 60px)
    color #000
    font-size 20px
    font-weight bold
    background rgba(245, 245, 245, 0.6)
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

    .menu
      display flex
      align-items center
      justify-content center
      height 40px
      padding 10px 5px
      background #eee

      .talk-menu
        display flex
        align-items center
        justify-content center

        .sep
          height 20px
          border 1px solid #bbb
          margin 0 5px 0 6px

      .icon
        display flex
        width 35px
        height 35px
        cursor pointer

        img
          width 100%

  .talk-wrapper
    display flex
    flex-direction column
    max-width 100vw
    min-height 100vh
    background #eff7ff

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
