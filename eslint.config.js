import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: {
      overrides: {
        'vue/require-typed-ref'                      : 'error',
        'vue/singleline-html-element-content-newline': 'off',
        'vue/component-definition-name-casing'       : ['error', 'PascalCase'],
        'vue/component-name-in-template-casing'      : ['error', 'PascalCase', {
          registeredComponentsOnly: false,
          ignores                 : [],
        }],
        'vue/block-lang': [
          'error',
          {
            script: { lang: ['ts', 'tsx'] },
            style : { lang: ['less', 'css'] },
          },
        ],
      },
    },
    typescript: {
      overrides: {
        'style/semi'                   : ['error', 'never'],
        'unused-imports/no-unused-vars': 'off',
        'no-console'                   : 'off',
        'ts/no-unused-expressions'     : 'off',
        'perfectionist/sort-imports'   : ['error', { type: 'line-length' }],
        // 'ts/method-signature-style': 'off',
        // 'ts/no-empty-object-type': 'off',
      },
    },
  },
  {
    rules: {
      'style/key-spacing': ['error', {

        align: {
          mode       : 'minimum',
          beforeColon: false,
          afterColon : true,
          on         : 'colon',
        },
        multiLine: {
          beforeColon: false,
          afterColon : true,
        },
      }],
      'style/no-multi-spaces'        : 'off',
      'style/type-annotation-spacing': 'off',

    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'antfu/top-level-function': 'off',
    },
  },
  // {
  //   files   : ['**/*.vue'],
  //   settings: {
  //     'import/core-modules': ['vue-router/auto-routes'],
  //   },
  //   rules: {
  //     'vue/operator-linebreak': ['error', 'before'],
  //   },
  // }
)
