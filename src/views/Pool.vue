<template>
  <div class="flex flex-col items-center">
    <!-- 范围限定区域 -->
    <div class="search-container">
      <el-select v-model="stat" class="search-select" @change="handleSearch">
        <el-option v-for="item in statOptions" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>
      <el-select v-model="level" class="search-select" @change="handleSearch">
        <el-option v-for="item in levelOptions" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>
    </div>

    <!-- 展示区域 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center justify-center">
      <PoolCard
        v-for="item in data"
        v-bind="item"
        :key="item.song.id"
      />
    </div>
    <div class="boardpagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :pager-count="5"
        :page-size="20"
        :total="total"
        v-model:current-page="page"
        class="pagination"
        @current-change="handlePageChanged"
      />
    </div>
  </div>

<CommentFrame />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import CommentFrame from '@/components/user/CommentFrame.vue';
import { useStatusStore } from '@/store/status.ts';
import PoolCard from '@/components/PoolCard.vue';
import { ElPagination } from 'element-plus';
import { useTitle } from '@vueuse/core';
import api from '@/utils/api/api';
import type { Snapshot, Song, Video } from '@/utils/RankingTypes';
import type { DataItem } from '@/utils/calculator.ts';

useTitle('歌曲数据列表 | 术力口数据库')
const statusStore = useStatusStore()

// 响应式数据
const total = ref(1000)
const data = ref<{
  song: Song,
  video: Video,
  snapshot: Snapshot
}[]>();
const stat = ref<DataItem>('view');
const level = ref(3);
const page = ref(1);

// 配置项
const statOptions = [
  { value: 'view', label: '播放' },
  { value: 'favorite', label: '收藏' },
  { value: 'coin', label: '硬币' },
  { value: 'like', label: '点赞' },
]

const levelOptions = [
  { value: 1, label: '1万' },
  { value: 2, label: '10万' },
  { value: 3, label: '100万' },
  { value: 4, label: '1000万' },
]


// 方法
async function handleSearch() {
  let result = await api.getSongByAchievement(stat.value, level.value, page.value, 30)

  data.value = result.data;
  total.value = result.total;
}

const handlePageChanged = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


watch([stat, level], (pool) => {
  statusStore.articleId = `pool-${pool[0]}-${pool[1]}`
}, { immediate: true })

watch(page, async () => {
  await handleSearch();
}, {immediate: true})
</script>


<style lang="scss" scoped>
.search-container {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;

  .search-input {
    flex: 1 1 200px;

    :deep(.el-input-group__append) {
      padding: 0 12px;
    }
  }

  .search-select {
    width: 100px;
  }
}
.board-header {
  padding: 0px 0px;
  margin: 0px 0px 20px 0px;
  width: 100%;
  text-align: center;
  background: rgba(255, 255, 255, 0.8);
}
#last-next-issues {

  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  * {
    font-size: 15px;
    color: #8a8a8a;
    width: auto;
  }
  .boardpagination {
    display: flex;
    justify-content: center;
    padding: 15px 10px;
  }
}


@media (max-width: 640px) {
  .boardpagination {
    padding: 10px 5px;
  }

  .pagination {
    font-size: 12px;
    :deep(.el-pagination__jump) {
      margin-left: 0;
    }
    :deep(.el-pagination button) {
      min-width: 16px;
    }
    :deep(.el-pager li) {
      min-width: 16px;
    }
  }
}



</style>
