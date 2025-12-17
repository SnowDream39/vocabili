<template>
  <div class="w-full flex justify-between items-center">
    <div class="font-bold grow m-r-1">{{ artist.name }}</div>
    <router-link class="block" :to="`/${type}/${artist.id}`">
      <el-button type="primary">查看</el-button>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import type { Uploader } from '@/utils/RankingTypes';
import { ElButton } from 'element-plus';

defineProps<{
  artist: Uploader,
  type: string
}>()

</script>
