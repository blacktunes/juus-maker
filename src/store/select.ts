import { reactive } from 'vue'

const select = reactive({
  show: false,
  type: 0,
  index: 0,
  key: 0
})

const resetSelectData = () => {
  select.show = false
  select.type = 0
  select.index = 0
  select.key = 0
}

const filter = reactive({
  show: false,
  /** 类型 */
  param1: new Set<string>(),
  /** 稀有度 */
  param2: new Set<string>(),
  /** 阵营 */
  param3: new Set<string>(),
  /** 分组 */
  param4: new Set<string>()
})

const resetFilterData = () => {
  filter.show = false
  filter.param1.clear()
  filter.param2.clear()
  filter.param3.clear()
  filter.param4.clear()
}

export { select, resetSelectData, filter, resetFilterData }
