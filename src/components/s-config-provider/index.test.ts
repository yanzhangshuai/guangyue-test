import { createVNode } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ConfigProvider from './index.vue'

describe('s-config-provider', () => {
  it('component exist', () => {
    expect(ConfigProvider).toBeTruthy()
  })

  it('slots', () => {
    const text = 'default slot'
    const wrapper = mount(ConfigProvider, {
      slots: {
        default: () => createVNode('h1', { class: 'slot' }, text),
      },
    })
    expect(wrapper.find('.slot').text()).toEqual(text)
  })
})
