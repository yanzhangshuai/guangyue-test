import type { Ref } from 'vue'
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, EventDataNode } from 'ant-design-vue/es/tree'

import { set } from '@vueuse/core'
import { reactive, unref } from 'vue'
import { UniversalTreeCache } from '@/utils/cache-tree'

import type { DragState, TreeDataNode } from './types'

import { updateNodeRelations } from './util'

export function useDragTree(treeData: Ref<TreeDataNode[]>) {
  const dragState = reactive<DragState>({
    srcNode   : null,
    targetNode: null,
  })

  const cache = new UniversalTreeCache<TreeDataNode>()

  // 更新缓存
  const updateCache = (tree: TreeDataNode[]) => {
    requestIdleCallback(() => {
      // 缓存更新，在空闲时执行就行
      cache.precacheTree(tree, { clear: true })
    })
  }

  updateCache(unref(treeData))

  const canDrop = (target: EventDataNode): boolean => {
    // 是否可以拖拽节点，
    // 判断条件：不能拖拽到自己或子节点
    const srcNode = dragState.srcNode

    if (!srcNode || !target)
      return false

    const srcKey    = srcNode.key
    const targetKey = target.key.toString()

    return !(targetKey === srcKey || targetKey.startsWith(srcKey))
  }

  const isMoveOperation = (info: AntTreeNodeDropEvent): boolean => {
    // 是否为移动操作
    // 判断移动有两个条件：
    // 1.dropToGap=true且必须是同级节点
    // 2.node=父节点，且dropPosition=dropPos[dropPos.length - 1],表示移动到索引0的位置

    const { dropToGap, node, dropPosition } = info
    const srcNode = dragState.srcNode

    if (!srcNode)
      return false

    const targetNode = node.dataRef as TreeDataNode

    // 情况1: 同级节点间的移动
    if (dropToGap && targetNode.parentKey === srcNode.parentKey) {
      return true
    }

    // 情况2: 移动到父节点的首位置
    // TODO: 没有处理展开时，node=父节点，拖到末尾时
    if (srcNode.parentKey === targetNode.key) {
      const dropPos = node?.pos?.split('-')?.map(Number) || []
      // at 为chrome 92+的特性
      return dropPos.at(-1) === dropPosition
    }

    return false
  }

  // 更新hint 信息
  const getHint = (info: AntTreeNodeDragEnterEvent) => {
    const { node } = info

    console.log('info', info)

    // if (isMoveOperation(info)) {

    // }

    const src     = dragState.srcNode as TreeDataNode
    const target  = node.dataRef as TreeDataNode

    // 提示信息
    return `拖拽 ${src.name} 到 ${target.name} 的位置`
  }

  const handleMove = (info: AntTreeNodeDropEvent) => {
    const { node, dragNode, dropPosition } = info

    const src     = dragNode.dataRef as TreeDataNode
    const target  = node.dataRef as TreeDataNode

    const tree    = unref(treeData)

    const reorder = (children?: TreeDataNode[]) => {
      const list = children?.slice() || [] // 浅拷贝
      if (!list.length)
        return list

      // 移除原节点
      const srcIndex = list.findIndex(item => item.key === src.key)
      list.splice(srcIndex, 1)

      // 计算插入位置
      let insertAt = target.parentKey !== src.parentKey
        ? 0  // 不同父节点时插到开头
        : srcIndex > dropPosition
          ? dropPosition     // 上移
          : dropPosition - 1 // 下移
      insertAt = Math.max(0, Math.min(insertAt, list.length))
      // 插入节点
      list.splice(insertAt, 0, src)

      return list
    }

    // 根节点处理
    if (!src.parentKey) {
      set(treeData, reorder(tree))
    }
    else {
      // 处理非根节点
      const parent = cache.find(src.parentKey, tree)
      if (parent) {
        parent.children = reorder(parent.children)
      }
    }
  }

  const handleMerge = (info: AntTreeNodeDropEvent) => {
    // 合并节点
    const { node, dragNode } = info

    const src     = dragNode.dataRef as TreeDataNode
    const target  = node.dataRef as TreeDataNode

    const tree    = unref(treeData)

    // 合并到目标节点
    const targetNode = cache.find(target.key, tree)
    if (targetNode) {
      targetNode.children = [
        ...(targetNode.children || []),
        ...updateNodeRelations(src.children || [], target.key),
      ]
    }

    // 从原位置移除
    const parentNodes = src.parentKey
      ? cache.find(src.parentKey, tree)?.children || []
      : tree

    const index = parentNodes.findIndex(item => item.key === src.key)
    if (index > -1) {
      parentNodes.splice(index, 1)
    }

    // 更新缓存
    updateCache(unref(treeData))
  }

  return {
    dragState,
    canDrop,
    isMoveOperation,
    getHint,
    handleMove,
    handleMerge,
  }
}
