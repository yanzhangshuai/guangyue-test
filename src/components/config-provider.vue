<script lang="ts" setup>
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <div class="config-provider">
    <AConfigProvider :locale="zhCN">
      <slot />
    </AConfigProvider>
  </div>
</template>

<style lang="less"></style>
