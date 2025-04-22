import type { App } from 'vue'

import { createPinia } from 'pinia'
import { definePlugin } from '@/utils/define'

export default definePlugin({
  install(app: App) {
    const store = createPinia()

    app.use(store)
  },
})
