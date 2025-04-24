import type { TreeNodeDto } from '@/service/tree/type'

import { nextTick } from 'vue'
import { Modal } from 'ant-design-vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { TreeDataNode } from './types'

import Tree from './index.vue'
import { convertToATreeData } from './utils'

describe('treeComponent', () => {
  const mockNodes: TreeNodeDto[] = [
    {
      id      : 1,
      name    : 'Node 1',
      children: [
        {
          id      : 11,
          name    : 'Node 1-1',
          children: [
            { id: 111, name: 'Node 1-1-1' },
          ],
        },
        { id: 12, name: 'Node 1-2' },
        { id: 13, name: 'Node 1-3' },
      ],
    },
    {
      id      : 2,
      name    : 'Node 2',
      children: [
        { id: 21, name: 'Node 2-1' },
        { id: 22, name: 'Node 2-2' },
      ],
    },
  ]

  let appContainer: HTMLElement

  let treeData: TreeDataNode[] = []

  vi.mock('ant-design-vue', async () => {
    const actual = await vi.importActual('ant-design-vue')
    return {
      ...actual,
      Modal: {
        confirm: vi.fn().mockImplementation((options) => {
          options.onOk?.()
        }),
      },
    }
  })

  beforeEach(() => {
    treeData = convertToATreeData(mockNodes)
  })

  beforeEach(() => {
    vi.clearAllMocks()

    // 创建根节点
    appContainer = document.createElement('div')
    appContainer.id = 'app'
    document.body.appendChild(appContainer)
  })

  beforeEach(() => {
    // 设置全局函数
    vi.stubGlobal('requestIdleCallback', (cb: (val: object) => void) => {
      setTimeout(() => cb({ timeRemaining: () => 16 }), 0)
      return 1
    })
    vi.stubGlobal('cancelIdleCallback', vi.fn())

    vi.stubGlobal('requestAnimationFrame', (cb: (val: number) => void) => {
      cb(0)
      return 0
    })
    vi.stubGlobal('requestAnimationFrame', vi.fn())
  })

  afterEach(() => {
    appContainer.remove()
  })

  describe('组件渲染', () => {
    it('组件基本渲染', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      //  断言树节点
      expect(wrapper.find('.ant-tree').exists()).toBe(true)
    })

    it('组件响应props变化更新树数据', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      const newNodes = [...mockNodes, { id: 3, name: 'New Node' }]
      await wrapper.setProps({ nodes: newNodes })

      // 断言树节点数量
      expect(wrapper.vm.treeData).toHaveLength(newNodes.length)
    })
  })

  describe('拖拽操作', () => {
    it('拖拽开始事件', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      await wrapper.vm.onDragStart({

        // @ts-expect-error children类型问题
        node: {
          dataRef: {
            ...treeData[0],
          },
        },
      })

      // 断言srcNode
      expect(wrapper.vm.dragState.src).toBe(treeData[0].key)
    })

    it('拖拽进入节点事件', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src = treeData[0].key
      await wrapper.vm.onDragOver({
        // @ts-expect-error children类型问题
        node: {
          dataRef: treeData[0].children![0],
        },
      })

      expect(wrapper.vm.dragState.target).toBe(treeData[0].children![0].key)
      expect(wrapper.vm.hint.title).toBeDefined()
    })
  })

  it('不可操作', async () => {
    const wrapper = mount(Tree, {
      props: { nodes: mockNodes },
    })

    wrapper.vm.dragState.src = treeData[0].key
    wrapper.vm.dragState.target = treeData[0].children![0].key
    wrapper.vm.dragState.action = 2

    await wrapper.vm.onDrop({
      // @ts-expect-error children类型问题
      node: {

      },
      // @ts-expect-error children类型问题
      dragNode: {

      },
    })
    expect(wrapper.vm.treeData[0].id).toBe(treeData[0].id)
  })

  describe('移动操作', () => {
    it('根节点上移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[1].key
      wrapper.vm.dragState.target = treeData[0].key
      wrapper.vm.dragState.action = 2

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].id).toBe(treeData[1].id)
    })

    it('根节点下移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].key
      wrapper.vm.dragState.target = treeData[1].key
      wrapper.vm.dragState.action = 3

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      // 断言wrapper.vm.treeData[0]
      expect(wrapper.vm.treeData[0].id).toBe(treeData[1].id)
    })

    it('非根节点同夫节点上移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![1].key
      wrapper.vm.dragState.target = treeData[0].children![0].key
      wrapper.vm.dragState.action = 2

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children![0].id).toBe(treeData[0].children![1].id)
    })

    it('非根节点同夫节点下移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![1].key
      wrapper.vm.dragState.target = treeData[0].children![2].key
      wrapper.vm.dragState.action = 3

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children![2].id).toBe(treeData[0].children![1].id)
    })

    it('非同夫节点上移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![1].key
      wrapper.vm.dragState.target = treeData[1].children![1].key
      wrapper.vm.dragState.action = 2

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children).toHaveLength(2)
      expect(wrapper.vm.treeData[1].children).toHaveLength(3)
      expect(wrapper.vm.treeData[1].children![1].id).toBe(treeData[0].children![1].id)
    })

    it('非同夫节点下移', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![1].key
      wrapper.vm.dragState.target = treeData[1].children![1].key
      wrapper.vm.dragState.action = 3

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children).toHaveLength(2)
      expect(wrapper.vm.treeData[1].children).toHaveLength(3)
      expect(wrapper.vm.treeData[1].children![2].id).toBe(treeData[0].children![1].id)
    })
  })

  describe('合并操作', () => {
    it('显示确认模态框', async () => {
      const wrapper = mount(Tree, {
        props : { nodes: mockNodes },
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })

      wrapper.vm.dragState.src    = treeData[0].key
      wrapper.vm.dragState.target = treeData[1].key
      wrapper.vm.dragState.action = 1
      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('根节点合并节点', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].key
      wrapper.vm.dragState.target = treeData[1].key
      wrapper.vm.dragState.action = 1

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData).toHaveLength(1)
      expect(wrapper.vm.treeData[0].id).toBe(treeData[1].id)
      expect(wrapper.vm.treeData[0].children).toHaveLength(5)
    })

    it('非根节点同夫节点合并节点', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![0].key
      wrapper.vm.dragState.target = treeData[0].children![2].key
      wrapper.vm.dragState.action = 1

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children).toHaveLength(2)
      expect(wrapper.vm.treeData[0]!.children![1].children).toHaveLength(1)
      expect(wrapper.vm.treeData[0]!.children![1].id).toBe(treeData[0].children![2].id)
      expect(wrapper.vm.treeData[0]!.children![1].children![0].id).toBe(treeData[0].children![0].children![0]!.id)
    })

    it('非根节点非夫节点合并节点', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.dragState.src    = treeData[0].children![0].key
      wrapper.vm.dragState.target = treeData[1].children![1].key
      wrapper.vm.dragState.action = 1

      // @ts-expect-error children类型问题
      await wrapper.vm.onDrop({})

      expect(wrapper.vm.treeData[0].children).toHaveLength(2)
      expect(wrapper.vm.treeData[1]!.children![1].children).toHaveLength(1)
      expect(wrapper.vm.treeData[1]!.children![1].children![0].id).toBe(treeData[0].children![0].children![0]!.id)
    })
  })

  it('渲染拖拽提示', async () => {
    const wrapper = mount(Tree, {
      props : { nodes: mockNodes },
      global: {
        stubs: {
          Teleport: {
            template: '<div><slot /></div>',
          },
        },
      },
    })

    wrapper.vm.hint = {
      title: '拖拽提示',
      x    : 20,
      y    : 30,
    }

    await nextTick()

    expect(wrapper.vm.hint.title).toBe('拖拽提示')
    const hint = wrapper.find('.hint')
    expect(hint.exists()).toBe(true)
    expect(hint.text()).toBe('拖拽提示')
    expect(hint.attributes('style')).toContain('left: 20px')
    expect(hint.attributes('style')).toContain('top: 30px')
  })
})
