<template>
  <template v-for="[index, item] in items.entries()">
    <el-link underline="always" :href="`/artist/${type}/${item.id}`" target="_blank">{{ item.name }}</el-link>
    <span v-if="index < items.length - 1">、</span>
  </template>
</template>

<script lang="ts" setup>
import { ElLink } from 'element-plus';

defineProps<{
  items: {
    id: string;
    name: string;
  }[];
  type: string;
}>()
</script>
