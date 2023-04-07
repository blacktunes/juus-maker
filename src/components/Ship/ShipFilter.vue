<template>
  <div class="ship-filter" v-show="filter.show" @click.stop="hide">
    <div class="filter-wrapper">
      <div v-for="(item, key) in data" :key="key" class="btn-group">
        <div
          v-for="name in item.list"
          :key="name"
          class="btn"
          :style="{ background: filter[key].has(name) ? 'yellow' : '' }"
          @click="addFilter(key, name)"
        >
          {{ name }}
        </div>
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

const hide = () => { filter.show = false }

</script>

<style lang="stylus" scoped>
.ship-filter
  position absolute
  bottom 60px
  width 100%
  left 0
  height calc(100% - 60px)
  background rgba(0, 0, 0, 0.1)

  .filter-wrapper
    position absolute
    bottom 10px
    left 15px
    right 20px
    height fit-content
    border-radius 5px
    background rgba(255, 255, 255, 0.9)

    .btn-group
      display flex
      flex-wrap wrap

      .btn
        margin 5px
        background #000
        color #fff
</style>
