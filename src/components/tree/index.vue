<script lang="ts" setup>
import type { TreeNodeDto } from '@/service/tree/type'
import type { AntTreeNodeDragEnterEvent, AntTreeNodeDropEvent, AntTreeNodeMouseEvent } from 'ant-design-vue/es/tree'

import { set } from '@vueuse/core'
import { Modal } from 'ant-design-vue'
import { h, onUnmounted, ref, unref, watchEffect } from 'vue'

import type { TreeDataNode } from './types'

import { useDragTree } from './useDragTree'
import { convertToATreeData } from './utils'

const props = defineProps<{
  nodes: TreeNodeDto[]
}>()

const treeData = ref<TreeDataNode[]>([])
watchEffect(() => {
  set(treeData, convertToATreeData(props.nodes))
})

const hint = ref({
  title: '',
  x    : 0,
  y    : 0,
})

const { dragState, setAction, drop } = useDragTree(treeData)

const onDragStart = (e: AntTreeNodeMouseEvent) => {
  dragState.src = e.node.dataRef?.key?.toString()
}

const onDragOver = (info: AntTreeNodeDragEnterEvent) => {
  const targetNode = info.node.dataRef
  if (!targetNode)
    return

  dragState.target = targetNode.key?.toString()

  // 避免过度渲染
  requestAnimationFrame(() => {
    unref(hint).title = ''

    const action = setAction(info)

    let title = ''
    if (action === 1) {
      // merge
      title = `将与【${targetNode?.name}】节点合并`
    }
    else if (action === 2) {
      // move up
      title = `将放置在【${targetNode?.name}】的上方`
    }
    else if (action === 3) {
      // move down
      title = `将放置在【${targetNode?.name}】的下方`
    }

    set(hint, {
      title,
      x: info.event.clientX + 10,
      y: info.event.clientY + 10,
    })
  })
}

const onDragend = () => {
  hint.value = {
    title: '',
    x    : 0,
    y    : 0,
  }
}

onUnmounted(() => {
  // 清除拖拽状态
  dragState.src    = undefined
  dragState.target = undefined
})

const onDrop = (info: AntTreeNodeDropEvent) => {
  drop(info, (action, name1, name2) => {
    return new Promise((resolve) => {
      if (action !== 1) {
        // 移动不需要确认
        return resolve(true)
      }

      const content = h('div', null, [
        h('p', null, `确定将 【${name1}】 合并到 【${name2}】 吗？`),
        h('p', null, `合并后，【${name1}】 将被删除`),
      ])

      Modal.confirm({
        title: '提示',
        content,
        onOk() {
          resolve(true)
        },
        onCancel() {
          resolve(false)
        },
      })
    })
  })
}

defineExpose({
  treeData,
  dragState,
  onDragStart,
  onDragOver,
  onDrop,
  hint,
})
</script>

<template>
  <Teleport to="#app">
    <div v-show="hint.title" class="hint" :style="{ left: `${hint.x}px`, top: `${hint.y}px` }">
      {{ hint.title }}
    </div>
  </Teleport>

  <div class="tree">
    <ATree
      show-line
      draggable
      block-node
      :tree-data="treeData"
      @dragstart="onDragStart"
      @dragover="onDragOver"
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
