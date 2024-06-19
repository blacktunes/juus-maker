export const data = reactive<{
  title: string
  subTitle: string
  tip?: string
  required: boolean
  text: string
  textarea?: boolean
  fn?: (str: string | null) => void
}>({
  title: '',
  subTitle: '',
  tip: undefined,
  required: true,
  text: '',
  textarea: undefined,
  fn: undefined
})

let confirm = () => {}
export const callback = {
  open: (config: {
    title: string
    subTitle?: string
    tip?: string
    required?: boolean
    defaultText?: string
    textarea?: boolean
  }) => {
    return new Promise<string | null>((resolve) => {
      data.title = config.title
      data.subTitle = config.subTitle ?? ''
      data.tip = config.tip
      data.required = config.required === undefined ? true : config.required
      if (config.defaultText) {
        data.text = config.defaultText
      }
      data.textarea = config.textarea
      data.fn = (str: string | null) => {
        resolve(str)
      }
    })
  },
  close: () => {
    data.fn?.(null)
    data.title = ''
    data.subTitle = ''
    data.tip = undefined
    data.required = true
    data.text = ''
    data.textarea = undefined
    data.fn = undefined
  },
  set confirm(fn: () => any) {
    confirm = fn
  },
  get confirm() {
    return () => {
      confirm()
    }
  }
}
