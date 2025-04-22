import type { App } from 'vue'

import { definePlugin } from '@/utils/define'
import { routes } from 'vue-router/auto-routes'
import { createRouter, createWebHistory } from 'vue-router'

export default definePlugin<[(app: App) => void]>({
  install(app, readyCallBack) {
    const router = setup()

    if (!router)
      return

    app.use(router)

    router.isReady()
      .then(() => readyCallBack(app))
      .catch((err) => {
        if (!app.config.errorHandler) {
          console.error(err)
        }
      })
  },
})

function setup() {
  const r = createRouter({
    history: createWebHistory(),
    routes : routes.concat([
      { path: '/', redirect: '/home' },
      { path: '/:catchAll(.*)', redirect: '/error/404' },
    ]),
  })

  return r
}
