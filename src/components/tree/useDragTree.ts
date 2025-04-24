import type { Ref } from 'vue'
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent } from 'ant-design-vue/es/tree'

import { set } from '@vueuse/core'
import { reactive, unref } from 'vue'
import { UniversalTreeCache } from '@/utils/cache-tree'

import type { ActionType, DragState, TreeDataNode } from './types'

import { updateNodeRelations } from './utils'

export function useDragTree(treeData: Ref<TreeDataNode[]>) {
  const dragState = reactive<DragState>({
    src   : '',
    target: '',
    action: 0,
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

  const setAction = (info: AntTreeNodeDragEnterEvent): ActionType => {
    // 初始化动作0,无操作
    dragState.action = 0
    const { src, target } = dragState

    // 验证条件
    if (!src || !target || target === src || target.startsWith(src))
      // 拖拽到自己或子节点
      return 0

    const targetNode = cache.find(target, unref(treeData))
    if (!targetNode)
      return 0

    // 检查层级是否相同
    const srcLevel    = src?.split('-')?.length || 0
    const targetLevel = targetNode.key?.split('-')?.length || 0

    if (srcLevel !== targetLevel) {
      // 不同层级不允许拖拽
      return 0
    }

    const { event } = info
    const targetRect = (event.target as HTMLElement).getBoundingClientRect()

    const offset1 = 4
    const offset2 = 8

    const topThreshold    = targetRect.top + offset2
    const bottomThreshold = targetRect.top + targetRect.height - offset1

    if (event.y >= topThreshold && event.y <= bottomThreshold) {
      // merge
      dragState.action = 1
    }
    else if (event.y < topThreshold) {
      // move up
      dragState.action = 2
    }
    else if (event.y > bottomThreshold) {
      // move down
      dragState.action = 3
    }

    return dragState.action
  }

  const move = (_: AntTreeNodeDropEvent) => {
    const { action, src, target } = dragState

    if (![2, 3].includes(action))
      // 无操作, 直接返回
      return

    const srcNode     = cache.find(src, unref(treeData))
    const targetNode  = cache.find(target, unref(treeData))
    if (!srcNode || !targetNode)
      return

    const tree = unref(treeData)

    /**
     * 重新排序节点
     * @param targetNodes 目标节点列表
     * @param srcNodes 源节点列表（可选，不同父节点时使用）
     * @returns [排序后的目标节点列表, 排序后的源节点列表]
     */
    const reorder = (targetNodes: TreeDataNode[], srcNodes?: TreeDataNode[]) => {
      // 浅拷贝，避免直接修改原数据
      targetNodes = targetNodes.slice()
      srcNodes    = srcNodes?.slice()

      if (srcNodes) {
        // 不同父节点 - 从源节点列表中删除
        const delAt = srcNodes.findIndex(item => item.key === srcNode.key)
        delAt > -1 && srcNodes.splice(delAt, 1)
      }
      else {
        // 相同父节点，从目标节点列表中删除
        const delAt = targetNodes.findIndex(item => item.key === srcNode.key)
        delAt > -1 && targetNodes.splice(delAt, 1)
      }

      // 计算插入位置
      // action 2: 上移, 3: 下移, 下移时需要加1
      const targetIdx = targetNodes.findIndex(item => item.key === targetNode.key)
      const insertAt  = Math.max(0, targetIdx + (action === 2 ? 0 : 1))

      // 插入节点
      // 如果srcNodes不为空，则表示targetNodes !== srcNodes，需要更新源节点的父节点
      const nodeToInsert = srcNodes
        ? srcNode
        : updateNodeRelations([srcNode!], targetNode.parentKey)[0]

      targetNodes.splice(insertAt, 0, nodeToInsert)

      return [targetNodes, srcNodes]
    }

    // 如果srcNodes为空，则表示targetNodes === srcNodes

    // 获取目标节点的同级节点（如果目标节点是根节点则获取整个树）
    const targetNodes = targetNode.parentKey
      ? cache.find(targetNode.parentKey, tree)?.children || []
      : tree

    // 如果源节点和目标节点在不同父节点下，获取源节点的同级节点
    let srcNodes: TreeDataNode[] | undefined

    if (srcNode.parentKey && srcNode.parentKey !== targetNode.parentKey) {
      srcNodes = cache.find(srcNode.parentKey, tree)?.children || []
    }

    // 重新排序节点
    const [reorderedTargetNodes, reorderedSrcNodes] = reorder(targetNodes, srcNodes)

    // 更新目标节点位置
    if (!targetNode.parentKey) {
      // 根节点情况, 直接更新treeData
      set(treeData, reorderedTargetNodes)
    }
    else {
      // 非根节点情况,找到targetNode的父节点,进行更新
      const targetParent = cache.find(targetNode.parentKey, tree)

      if (targetParent) {
        targetParent.children = reorderedTargetNodes
      }
    }

    // 如果涉及不同父节点，更新源节点位置
    if (srcNode.parentKey && srcNode.parentKey !== targetNode.parentKey && reorderedSrcNodes) {
      const srcParent = cache.find(srcNode.parentKey, tree)

      if (srcParent) {
        srcParent.children = reorderedSrcNodes
      }
    }

    // 更新缓存
    updateCache(unref(treeData))
  }

  const merge = (_: AntTreeNodeDropEvent) => {
    // 合并操作

    if (dragState.action !== 1)
      return

    const { src: srcKey, target: targetKey } = dragState

    const tree    = unref(treeData)
    const srcNode = cache.find(srcKey, tree)
    if (!srcNode)
      return

    // 合并到目标节点
    const targetNode  = cache.find(targetKey, tree)
    if (targetNode) {
      // 更新所有合并节点的parentKey
      targetNode.children = [
        ...(targetNode.children || []),
        ...updateNodeRelations(srcNode?.children || [], targetKey),
      ]
    }

    // 从原位置移除
    const parentNodes = srcNode.parentKey
      ? cache.find(srcNode.parentKey, tree)?.children || []
      : tree

    const index = parentNodes.findIndex(item => item.key === srcKey)
    if (index > -1) {
      parentNodes.splice(index, 1)
    }

    // 更新缓存
    updateCache(unref(treeData))
  }

  const drop = async (info: AntTreeNodeDropEvent, beforeDrop?: (action: ActionType, srcName: string, targetName: string) => Promise<boolean>) => {
    beforeDrop = beforeDrop || (() => Promise.resolve(true))

    if (dragState.action === 0) {
      // 无操作
      return
    }

    const { src: srcKey, target: targetKey } = dragState

    const srcNode     = cache.find(srcKey, unref(treeData))
    const targetNode  = cache.find(targetKey, unref(treeData))
    if (!srcNode || !targetNode)
      // 无效的拖拽
      return

    try {
      const res = await beforeDrop(dragState.action, srcNode.name, targetNode.name)

      if (!res) {
        return
      }

      if (dragState.action === 1) {
        // 合并
        merge(info)
      }
      else if ([2, 3].includes(dragState.action)) {
        // 移动
        move(info)
      }
    }
    catch (error) {
      console.error('Error in beforeDrop:', error)
    }
  }

  return {
    dragState,
    setAction,
    drop,
  }
}
