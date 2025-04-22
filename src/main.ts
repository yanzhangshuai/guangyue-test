import Store from '@/store'
import App from '@/app.vue'
import Router from '@/router'
import Service from '@/service'
import { createApp } from 'vue'
import 'virtual:uno.css'

import './app.less'

const app = createApp(App)

app
  .use(Service)
  .use(Store)
  .use(Router, () => app.mount('#app'))
