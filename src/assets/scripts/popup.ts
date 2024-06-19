import { confirm } from '@/components/Popup/Confirm'
import { cropper } from '@/components/Popup/Cropper'
import { input } from '@/components/Popup/Input'
import Loading from '@/components/Popup/Loading.vue'

import { createPopupManager } from 'star-rail-vue'

export const popupManager = createPopupManager({
  loading: {
    component: Loading
  },
  cropper,
  confirm,
  input
})
