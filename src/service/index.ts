import axios from 'axios'
import { definePlugin } from '@/utils/define'

export default definePlugin({
  install() {
    setup()
  },
})

function setup() {
  axios.defaults.baseURL = 'api/'
  // setupInterceptor(axios.interceptors);
}
