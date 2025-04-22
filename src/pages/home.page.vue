<script lang="ts" setup>
import type { TreeNode } from '@/service/tree/type'

import { ref } from 'vue'
import { useTreeService } from '@/service/tree'

const treeService = useTreeService()

const treeData = ref<TreeNode[]>([])

treeService.getTreeData()
  .then((res) => {
    treeData.value = res
  })
  .catch((err) => {
    console.error('Error fetching tree data:', err)
  })
</script>

<template>
  <h1>{{ treeData.length }}</h1>
</template>

<style lang="less" scoped></style>
