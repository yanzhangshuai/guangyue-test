/// <reference types="vitest" />
import fs from 'node:fs'
import UnoCSS from 'unocss/vite'
import process from 'node:process'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'
import VueRouter from 'unplugin-vue-router/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig(() => {
  return {
    plugins: [
      UnoCSS(),
      vue(),
      Components({ resolvers: [AntDesignVueResolver({ importStyle: 'less' })] }),
      VueRouter({ extensions: ['.page.vue'] }),
      vueDevTools(),
      viteMockServe(),
    ],
    server: {
      host: true,
      port: 3010,
    },

    resolve: {
      alias:  {
        '@': fs.realpathSync(`${process.cwd()}/src`),

      },
    },

    test: {
      globals    : true,
      environment: 'jsdom',
      include    : ['**/*.{test,spec}.ts'],
      coverage   : {
        extensions: ['.vue'],
        reporter  : ['text', 'json', 'html'],
      },
    },
    inspectBrk     : true,
    fileParallelism: false,
    browser        : {
      provider : 'playwright',
      instances: [{ browser: 'chromium' }],
    },

  }
})
