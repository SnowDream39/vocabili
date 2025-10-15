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
import { ref, watch } from 'vue';

const bgManager = useBgManager()
const autoRefresh = ref<Boolean>(bgManager.autoRefresh)

watch(autoRefresh, (value) => {
  bgManager.autoRefresh = value
})
</script>
