import { cropper } from '@/components/Popup/Cropper'
import Loading from '@/components/Popup/Loading.vue'

import { createPopupManager } from 'star-rail-vue'

export const popupManager = createPopupManager({
  loading: {
    component: Loading
  },
  cropper
})
