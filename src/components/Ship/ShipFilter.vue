<template>
  <div class="ship-filter">
    <div
      class="filter-wrapper"
      @click.stop
    >
      <div class="scroll-view">
        <div
          v-for="(item, key) in data"
          :key="key"
          class="item-group"
        >
          <FilterLabel
            :title="item.name"
            :sub-title="item.sub"
          />
          <div class="item-list">
            <FilterItem
              :highlight="filterSetting[key].size === 0"
              @click="resetType(key)"
            >
              全部
            </FilterItem>
            <FilterItem
              v-for="name in item.list"
              :key="name"
              :highlight="filterSetting[key].has(name)"
              @click.stop="addFilter(key, name)"
            >
              {{ name }}
            </FilterItem>
          </div>
        </div>
      </div>
      <div class="btn-wrapper">
        <WindowBtn
          class="btn"
          :type="2"
          @click="reset"
        >
          重置
        </WindowBtn>
        <WindowBtn
          class="btn"
          :type="3"
          @click="hide"
        >
          确定
        </WindowBtn>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filter } from '@/store/select'
import WindowBtn from '../Public/WindowBtn.vue'
import FilterItem from './FilterItem.vue'
import FilterLabel from './FilterLabel.vue'
import { ship } from '@/store/ship'

const filterSetting = reactive({
  param1: new Set<string>(),
  param2: new Set<string>(),
  param3: new Set<string>(),
  param4: new Set<string>()
})

watch(
  () => filter.show,
  () => {
    if (filter.show) {
      filterSetting.param1 = new Set([...filter.param1])
      filterSetting.param2 = new Set([...filter.param2])
      filterSetting.param3 = new Set([...filter.param3])
      filterSetting.param4 = new Set([...filter.param4])
    } else {
      filter.param1 = new Set([...filterSetting.param1])
      filter.param2 = new Set([...filterSetting.param2])
      filter.param3 = new Set([...filterSetting.param3])
      filter.param4 = new Set([...filterSetting.param4])
    }
  }
)

const data = {
  param1: {
    name: '索引',
    sub: 'INDEX',
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

  param3: {
    name: '阵营',
    sub: 'CAMP',
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
      '飓风'
    ]
  },
  param2: {
    name: '稀有度',
    sub: 'RARITY',
    list: ['普通', '稀有', '精锐', '超稀有', '海上传奇', '最高方案', '决战方案']
  },
  param4: {
    name: '附加索引',
    sub: 'INDEX',
    list: ['自定义']
  }
}

ship.game.forEach((item) => {
  const param1 = item.data.param1.split(',')
  param1.forEach((i) => {
    if (i && !data.param1.list.includes(i)) {
      data.param1.list.push(i)
    }
  })

  const param3 = item.data.param3.split(',')
  param3.forEach((i) => {
    if (i && i !== '其他' && !data.param3.list.includes(i)) {
      data.param3.list.push(i)
    }
  })

  const param4 = item.data.param4.split(',')
  param4.forEach((i) => {
    if (i && !data.param4.list.includes(i)) {
      data.param4.list.unshift(i)
    }
  })

})
data.param3.list.push('其他')

const addFilter = (type: 'param1' | 'param2' | 'param3' | 'param4', name: string) => {
  const param = filterSetting[type]
  if (param.has(name)) {
    param.delete(name)
  } else {
    param.add(name)
  }
}

const resetType = (type: 'param1' | 'param2' | 'param3' | 'param4') => {
  filterSetting[type].clear()
}

const reset = () => {
  filterSetting.param1.clear()
  filterSetting.param2.clear()
  filterSetting.param3.clear()
  filterSetting.param4.clear()
}

const hide = () => {
  filter.show = false
}
</script>

<style lang="stylus" scoped>
item()
  margin 5px
  padding 10px
  border 1px solid #ddd
  border-radius 10px
  background #fff
  user-select none

.ship-filter
  position absolute
  bottom 0px
  left 0
  z-index 11
  display flex
  flex-direction column
  box-sizing border-box
  width 100%
  height 100%

  .filter-wrapper
    position relative
    display flex
    flex-direction column
    box-sizing border-box
    margin 15px 15px 10px
    padding 10px
    height calc(100% - 25px)
    border 1px solid #ddd
    border-radius 10px
    background rgba(255, 255, 255, 0.8)

    .scroll-view
      flex 1
      overflow auto

      &::-webkit-scrollbar
        width 0
        height 0

      .item-group
        display flex
        flex-direction column
        align-items flex-start
        margin-bottom 10px

        &:last-child
          margin-bottom none

        .item-list
          z-index 1
          display grid
          flex 1
          justify-content space-evenly
          box-sizing border-box
          grid-template-columns 25% 25% 25% 25%
          justify-items center

  .btn-wrapper
    display flex
    justify-content center
    align-items center
    box-sizing border-box
    margin-top 10px
    height 55px
    color #fff

    .btn
      transform scale(0.8)
</style>
