<template>
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
  <PoolCard
    v-for="data in plainData"
    v-bind="data"
    v-if="plainData && plainData.length > 0"
    :key="data.point"
  />
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
<CommentFrame />
</template>

<script setup>
import { ref, computed, watch, onMounted, toRaw } from 'vue';
import { useRoute } from 'vue-router';
import { poolToPlain } from '../utils/dataConverter.ts'
import { requester } from '../utils/api/requester.ts'
import CommentFrame from '@/components/user/CommentFrame.vue';
import { usePageStore } from '@/store/page.ts';
const route = useRoute()
const pageStore = usePageStore()

// 响应式数据
const page = ref(Number(route.query.page) || 1)
const total = ref(1000)
const rawData = ref(null);
const stat = ref('view');
const level = ref('r3');

// 配置项
const statOptions = [
  { value: 'view', label: '播放' },
  { value: 'favorite', label: '收藏' },
  { value: 'coin', label: '硬币' },
  { value: 'like', label: '点赞' },
]

const levelOptions = [
  { value: 'r1', label: '1万' },
  { value: 'r2', label: '10万' },
  { value: 'r3', label: '100万' },
  { value: 'r4', label: '1000万' },
]

// 计算属性
const plainData = computed(() => {
  try {
    if (rawData.value) {
      return rawData.value.map(item => poolToPlain(item, rawData.value.metadata));
    }
    return [];
  } catch (error) {
    console.log(error)
    return [];
  }
});


// 方法
async function handleSearch() {
  let data = await requester.list_song_pool(`${stat.value}-${level.value}`, page.value, undefined)
  rawData.value = data.result;
  total.value = data.total;
}

const handlePageChanged = async () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


async function init() {
  const params = route.params
  await handleSearch()
}

// 注册事件
onMounted(init)
watch(() => route.path, init)

watch([stat, level], (pool) => {
  pageStore.name = `pool-${pool[0]}-${pool[1]}`
}, { immediate: true })


// 监听 page 变化，切换分页时重新获取数据
watch(page, async () => {
  await handleSearch();
}, { immediate: true });
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

 .pagination {
  max-width: 100%;
  font-size: 14px; // 减小默认字体大小
}
}
@media (max-width: 630px) {
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
