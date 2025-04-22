import { defineConfig, presetAttributify, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({

  presets: [
    presetUno(),
    presetAttributify({
      prefix      : 'un-',
      prefixedOnly: true,
    }),
  ],

  transformers: [
    transformerDirectives({
      applyVariable: ['--at-apply', '--uno-apply', '--uno'],
    }),
  ],

  theme: {
    colors: {
    },
    screens: {
    },
  },
})
