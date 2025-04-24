import type { TreeNodeDto } from '@/service/tree/type'

import { Modal } from 'ant-design-vue'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import Tree from './index.vue'

describe('treeComponent', () => {
  let appContainer: HTMLElement

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
    it('组件渲染', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      //  断言树节点
      expect(wrapper.find('.tree-container').exists()).toBe(true)
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
    it('拖拽开始事件', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      wrapper.vm.onDragStart({
        node: {
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[0],
          },
        },
      })

      // 断言srcNode
      expect(wrapper.vm.dragState.srcNode).toEqual(mockNodes[0])
    })

    it('拖拽进入节点事件', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[0],
      }
      await wrapper.vm.onDragEnter({
        node: {
          key     : '1-1',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[0].children![0],
          },
          pos     : '1-1',
          dragNode: { pos: '1' },
        },
      })

      expect(wrapper.vm.dragState.targetNode).toEqual(mockNodes[0].children![0])
      expect(wrapper.vm.hint.title).toBeDefined()
    })

    it('拖拽离开事件', async () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.targetNode = {
        ...mockNodes[0],
      }
      await wrapper.vm.onDragLeave()

      expect(wrapper.vm.dragState.targetNode).toBeNull()
    })

    it('拖拽结束事件', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[0],
      }
      // @ts-expect-error children类型问题
      wrapper.vm.dragState.targetNode = {
        ...mockNodes[0].children![0],
      }

      wrapper.vm.onDragend()

      expect(wrapper.vm.dragState.srcNode).toBeNull()
      expect(wrapper.vm.dragState.targetNode).toBeNull()
    })
  })

  it('不可操作', () => {
    const wrapper = mount(Tree, {
      props: { nodes: mockNodes },
    })

    // @ts-expect-error children类型问题
    wrapper.vm.dragState.srcNode = {
      ...mockNodes[0],
      key: '1',
    }

    // 断言canDrop 返回false
    expect(wrapper.vm.canDrop({
      key     : '1-11',
      // @ts-expect-error children类型问题
      dataRef: {
        ...mockNodes[0].children![0],
        key: '1-11',
      },
    })).toBe(false)
  })

  describe('移动操作', () => {
    it('根节点上移', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[0],
      }

      wrapper.vm.onDrop({
        dropPosition: -1,
        dropToGap   : true,
        dragNode    : {
          key    : '2',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[1],
          },
        },
        node: {
          key    : '1',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[0],
          },
        },
      })

      // 断言wrapper.vm.treeData[0]
      expect(wrapper.vm.treeData[0].id).equals(mockNodes[1].id)
    })

    it('根节点下移', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[1],
      }

      wrapper.vm.onDrop({
        dropPosition: 2,
        dropToGap   : true,
        dragNode    : {
          key    : '1',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[0],
            key: '1',
          },
        },
        node: {
          key    : '2',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[1],
            key: '2',
          },
          pos: '0-1',
        },
      })

      // 断言wrapper.vm.treeData[0]
      expect(wrapper.vm.treeData[0].id).equals(mockNodes[1].id)
    })

    it('非根节点下移', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[0].children![0],
        key: '1-11',
      }

      wrapper.vm.onDrop({
        dropPosition: 2,
        dropToGap   : true,
        dragNode    : {
          parentKey: '1',
          key      : '1-11',
          // @ts-expect-error children类型问题
          dataRef  : {
            parentKey: '1',
            ...mockNodes[0].children![0],
            key      : '1-11',
          },
        },
        node: {
          parentKey: '1',
          key      : '1-12',
          // @ts-expect-error children类型问题
          dataRef  : {
            parentKey: '1',
            ...mockNodes[0].children![1],
            key      : '1-12',
          },
        },
      })

      // 断言wrapper.vm.treeData[0]
      expect(wrapper.vm.treeData[0].children![0].id).equals(mockNodes[0].children![1].id)
    })

    it('非根节点上移', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[0].children![2],
        parentKey: '1',
        key      : '1-13',
      }

      wrapper.vm.onDrop({
        dropPosition: 1,
        dropToGap   : true,
        dragNode    : {
          parentKey: '1',
          key      : '1-13',
          // @ts-expect-error children类型问题
          dataRef  : {
            parentKey: '1',
            ...mockNodes[0].children![2],
            key      : '1-13',
          },
        },
        node: {
          parentKey: '1',
          key      : '1-12',
          // @ts-expect-error children类型问题
          dataRef  : {
            parentKey: '1',
            ...mockNodes[0].children![1],
            key      : '1-12',
          },
        },
      })

      // 断言wrapper.vm.treeData[0]
      expect(wrapper.vm.treeData[0].children![1].id).equals(mockNodes[0].children![2].id)
    })
  })

  describe('合并操作', () => {
    it('显示确认模态框', () => {
      const wrapper = mount(Tree, {
        props : { nodes: mockNodes },
        global: {
          stubs: {
            Teleport: true,
          },
        },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[1].children![1],
      }
      wrapper.vm.onDrop({
        dropPosition: 0,
        dragNode    : {
          key    : '2-21',
          pos    : '2-1-0',
          // @ts-expect-error children类型问题
          dataRef: mockNodes[0].children![1],
        },
        node: {
          key    : '1-1',
          // @ts-expect-error children类型问题
          dataRef: mockNodes[0].children![0],
        },
      })

      expect(Modal.confirm).toHaveBeenCalled()
    })

    it('合并节点', () => {
      const wrapper = mount(Tree, {
        props: { nodes: mockNodes },
      })

      // @ts-expect-error children类型问题
      wrapper.vm.dragState.srcNode = {
        ...mockNodes[1],
        key: '2',
      }

      wrapper.vm.onDrop({
        dropPosition: 0,
        dragNode    : {
          key    : '2',
          // @ts-expect-error children类型问题
          dataRef: {
            ...mockNodes[1],
            key: '2',
          },
        },
        node: {
          key      : '1-11',
          parentKey: '1',
          // @ts-expect-error children类型问题
          dataRef  : {
            ...mockNodes[0].children![0],
            key: '1-11',
          },
        },
      })

      expect(wrapper.vm.treeData).toHaveLength(1)
      expect(wrapper.vm.treeData![0].children![0].children).toHaveLength(3)
    })
  })

  // it('渲染拖拽提示', async () => {
  //   const wrapper = mount(Tree, {
  //     props : { nodes: mockNodes },
  //     global: {
  //       stubs: {
  //         Teleport: {
  //           template: '<div><slot /></div>',
  //         },
  //       },
  //     },
  //   })

  //   await wrapper.setData({
  //     hint: {
  //       title: '拖拽提示',
  //       x    : 20,
  //       y    : 30,
  //     },
  //   })

  //   const hint = wrapper.find('.hint')
  //   expect(hint.exists()).toBe(true)
  //   expect(hint.text()).toBe('拖拽提示')
  //   expect(hint.attributes('style')).toContain('left: 20px')
  //   expect(hint.attributes('style')).toContain('top: 30px')
  // })
})
