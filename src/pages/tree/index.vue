<script lang="ts" setup>
import type { TreeNodeDto } from '@/service/tree/type'
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, AntTreeNodeMouseEvent } from 'ant-design-vue/es/tree'

import { set } from '@vueuse/core'
import { Modal } from 'ant-design-vue'
import { h, ref, watchEffect } from 'vue'

import type { TreeDataNode } from './types'

import { useDragTree } from './useDragTree'
import { convertToATreeData  } from './util'

const props = defineProps<{
  nodes: TreeNodeDto[]
}>()

const treeData = ref<TreeDataNode[]>([])
watchEffect(() => {
  set(treeData, convertToATreeData(props.nodes))
})

const hint = ref({
  title: '',
  x    : 10,
  y    : 10,
})

const {
  dragState,
  canDrop,
  isMoveOperation,
  getHint,
  handleMove,
  handleMerge,
} = useDragTree(treeData)

const onDragStart = (e: AntTreeNodeMouseEvent) => {
  dragState.srcNode = e.node.dataRef as TreeDataNode
}

const onDragEnter = (info: AntTreeNodeDragEnterEvent) => {
  if (!canDrop(info.node)) {
    return
  }

  dragState.targetNode = info.node.dataRef as TreeDataNode

  // 使用requestAnimationFrame，避免频繁渲染
  requestAnimationFrame(() => {
    // 检查是否可以拖拽到该节点
    const title = getHint(info)
    set(hint, {
      title,
      x: 10, // info.event.clientX,
      y: 10, // info.event.clientY,
    })
  })
}

const onDragLeave = () => {
  dragState.targetNode = null
}

const onDragend = () => {
  // 清除拖拽状态
  dragState.srcNode     = null
  dragState.targetNode  = null

  // hint.value = {
  //   title: '',
  //   x    : 0,
  //   y    : 0,
  // }
}

const onDrop = (info: AntTreeNodeDropEvent) => {
  if (!canDrop(info.node))
    return

  if (isMoveOperation(info))
    return handleMove(info)

  const srcName = dragState.srcNode?.title
  const targetName = info.node.dataRef?.title

  const content = h('div', null, [
    h('p', null, `确定将 【${srcName}】 合并到 【${targetName}】 吗？`),
    h('p', null, `合并后，【${srcName}】 将被删除`),
  ])

  Modal.confirm({
    title: '提示',
    content,
    onOk() {
      handleMerge(info)
    },
  })
}
</script>

<template>
  <Teleport to="#app">
    <div class="hint" :style="{ left: `${hint.x}px`, top: `${hint.y}px` }">
      {{ hint.title }}
    </div>
  </Teleport>

  <div class="tree">
    <ATree
      class="tree-container"
      show-line
      draggable
      block-node
      :tree-data="treeData"
      @dragstart="onDragStart"
      @dragenter="onDragEnter"
      @dragleave="onDragLeave"
      @dragend="onDragend"
      @drop="onDrop"
    />
  </div>
</template>

<style lang="less" scoped>
.tree {
  padding: 12px;
  width: 360px;
  overflow: auto;
}

.hint {
  color: #fff;
  background-color: #009bff;
  position: fixed;
  padding: 8px 12px;
  border-radius: 4px;
}
:deep(.ant-tree-treenode-selected) {
  >span {
    color: #007fff !important;
  }
}
</style>
