<script lang="ts" setup>
import { useAsync } from '@/hooks/useAsync'
import { useTreeService } from '@/service/tree'

import CTree from './tree/index.vue'

const treeService = useTreeService()

const { isLoading, data, error } = useAsync(() => treeService.getTreeData(), { immediate: true })
</script>

<template>
  <div class="h-screen flex-x-center">
    <ASpin v-if="isLoading" />

    <AEmpty v-else-if="error" :description="`获取数据失败:${error}`" />

    <CTree v-else-if="data" :nodes="data" />
  </div>
</template>
