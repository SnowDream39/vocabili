<template>
  <div class="max-w-[400px]">
    <BackgroundImageController/>
    <div>
      <el-switch v-model="autoRefresh" active-text="自动刷新" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BackgroundImageController from '@/components/misc/BackgroundImageController.vue';
import { useBgManager } from '@/plugins/BackgroundImagePlugin'
import { useTitle } from '@vueuse/core';
import { ref, watch } from 'vue';

useTitle('个性设置 | 术力口数据库')
const bgManager = useBgManager()
const autoRefresh = ref<Boolean>(bgManager.autoRefresh)

watch(autoRefresh, (value) => {
  bgManager.autoRefresh = value
})
</script>
