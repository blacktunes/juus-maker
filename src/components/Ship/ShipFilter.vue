<template>
  <div class="ship-filter" @click.stop="hide">
    <div class="filter-wrapper" @click.stop>
      <div v-for="(item, key) in data" :key="key" class="btn-group">
        <div class="btn-label">{{ item.name }}</div>
        <div class="btn-list">
          <div class="btn" @click="resetType(key)">全部</div>
          <div
            v-for="name in item.list"
            :key="name"
            class="btn"
            :class="{ highlight: filter[key].has(name) }"
            @click.stop="addFilter(key, name)"
          >
            {{ name }}
          </div>
        </div>
      </div>
      <div class="btn-group-2">
        <div class="reset" @click="reset">重置</div>
        <div class="submit" @click="hide">确定</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter } from '@/store/select'

const data = {
  param4: {
    name: '分类',
    list: [
      '改造',
      '方案',
      'META',
      '联动',
      '特殊',
      '誓约',
      '专属兵装',
      '自定义'
    ]
  },
  param1: {
    name: '类型',
    list: [
      '前排先锋',
      '后排主力',
      '驱逐',
      '轻巡',
      '重巡',
      '超巡',
      '战巡',
      '战列',
      '航战',
      '航母',
      '轻航',
      '重炮',
      '维修',
      '潜艇',
      '潜母',
      '运输',
      '风帆'
    ]
  },
  param2: {
    name: '稀有度',
    list: [
      '普通',
      '稀有',
      '精锐',
      '超稀有',
      '海上传奇',
      '最高方案',
      '决战方案'
    ]
  },
  param3: {
    name: '阵营',
    list: [
      '白鹰',
      '皇家',
      '重樱',
      '铁血',
      '东煌',
      '撒丁帝国',
      '北方联合',
      '自由鸢尾',
      '维希教廷',
      '余烬',
      '其他',
      '飓风',
      '海王星',
      '哔哩哔哩',
      '传颂之物',
      'KizunaAI',
      'Hololive',
      '维纳斯假期',
      '偶像大师',
      'SSSS',
      'Atelier Ryza'
    ]
  }
}

const addFilter = (type: 'param1' | 'param2' | 'param3' | 'param4', name: string) => {
  const param = filter[type]
  if (param.has(name)) {
    param.delete(name)
  } else {
    param.add(name)
  }
}

const resetType = (type: 'param1' | 'param2' | 'param3' | 'param4') => {
  filter[type].clear()
}

const reset = () => {
  filter.param1.clear()
  filter.param2.clear()
  filter.param3.clear()
  filter.param4.clear()
}

const hide = () => { filter.show = false }

</script>

<style lang="stylus" scoped>
.ship-filter
  z-index 99
  position absolute
  bottom 0px
  width 100%
  left 0
  height 100%
  background rgba(0, 0, 0, 0.1)

  .filter-wrapper
    overflow auto
    max-height calc(100% - 120px)
    position absolute
    bottom 10px
    left 15px
    right 20px
    height fit-content
    border-radius 5px
    background rgba(255, 255, 255, 0.9)
    user-select none
    color #fff
    font-weight bold

    &::-webkit-scrollbar
      width 5px
      height 5px

    &::-webkit-scrollbar-track
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.4)
      border-radius 4px

    &::-webkit-scrollbar-thumb
      box-shadow inset 0 0 6px rgba(0, 0, 0, 0.3)
      border-radius 4px

    &::-webkit-scrollbar-thumb:active
      background-color #aaa

    .btn-group
      display flex
      align-items baseline
      margin 5px

      .btn-label
        z-index 0
        flex-shrink 0
        position relative
        width 80px
        height 30px
        padding 3px 2px 2px 10px
        background rgba(83, 112, 178, 0.7)

        &:before
          z-index -1
          content ''
          position absolute
          height 100%
          width 100%
          top -3px
          left -3px
          border 1px solid rgba(255, 255, 255, 0.2)
          box-sizing border-box
          background rgba(90, 141, 255, 0.5)

      .btn-list
        display flex
        flex-wrap wrap

        .btn
          box-sizing border-box
          margin 5px
          color #fff
          height 35px
          padding 5px 15px
          background #7a8b9b
          border-radius 3px
          border 1px solid rgba(255, 255, 255, 0.5)
          cursor pointer

    .btn-group-2
      position sticky
      bottom 0
      display flex
      align-items center
      justify-content center
      background rgba(255, 255, 255, 0.7)

      .reset, .submit
        box-sizing border-box
        display flex
        justify-content center
        align-items center
        width 100px
        height 40px
        margin 10px 20px
        border-radius 3px
        border 1px solid rgba(255, 255, 255, 0.5)
        font-size 20px
        font-weight bold
        cursor pointer

      .reset
        background #ce6d64

      .submit
        background #558ad0

.highlight
  background #87cefa !important
  text-shadow 1px 1px 3px rgba(0,0,0,0.5)
</style>
