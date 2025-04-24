import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider as AConfigProvider } from 'ant-design-vue'

import ConfigProvider from './config-provider.vue'

describe('configProvider 组件', () => {
  it('正确渲染 AConfigProvider 并提供中文locale', () => {
    const wrapper = mount(ConfigProvider, {
      slots: {
        default: '<div>测试内容</div>',
      },
    })
    // 验证根元素和类名
    expect(wrapper.find('.config-provider').exists()).toBe(true)

    // 验证 AConfigProvider 是否存在
    const configProvider = wrapper.findComponent(AConfigProvider)
    expect(configProvider.exists()).toBe(true)

    // 验证 props 传递是否正确
    expect(configProvider.props('locale')).toEqual(zhCN)

    // 验证插槽内容是否正确渲染
    expect(wrapper.text()).toContain('测试内容')
  })
  it('当没有提供插槽时不渲染内容', () => {
    const wrapper = mount(ConfigProvider)

    expect(wrapper.find('.config-provider').exists()).toBe(true)
    expect(wrapper.findComponent(AConfigProvider).exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })
})
