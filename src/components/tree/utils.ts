import type { TreeNodeDto } from '@/service/tree/type'

import type { TreeDataNode } from './types'

export function convertToATreeData(nodes: TreeNodeDto[], parentKey?: string): TreeDataNode[] {
  // 使用递归将接口数据转换为 ATree 组件需要的格式
  // ATree 组件需要的格式是 { key, title, children },
  return nodes.map((node) => {
    const { children, ...rest } = node

    // key= 父节点id-子节点id，
    // 这样做的目的有两个： 1.避免重复的 key， 2. 方便后续定位层级以及查找父、祖节点。
    const key = parentKey ? `${parentKey}-${node.id}` : node.id.toString()

    return {
      ...rest,
      key,
      parentKey,
      title   : node.name,
      children: children ? convertToATreeData(children, key) : undefined,
    }
  })
}

// 根据新parentKey递归更新所有的key，parentKey
export function updateNodeRelations(nodes: TreeDataNode[], parentKey?: string): TreeDataNode[] {
  return nodes.map((node) => {
    const { children, ...rest } = node

    const key = parentKey ? `${parentKey}-${node.id}` : node.id.toString()

    return {
      ...rest,
      key,
      children: children ? updateNodeRelations (children, key) : undefined,
      parentKey,
    }
  })
}
