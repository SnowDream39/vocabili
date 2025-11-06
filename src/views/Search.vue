<template>
  <div class="flex flex-col items-center">

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-input v-model="searchWord" placeholder="请输入标题或关键词" clearable class="search-input" @keyup.enter="handleSearch">
        <template #append>
          <button @click="handleSearch" >
             <div class="i-eva-search-outline" ></div>
          </button>
        </template>
      </el-input>

      <el-select v-model="searchTarget" class="search-select" placeholder="搜索类型" @change="handleSearch">
        <el-option v-for="item in searchTargetOptions" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>
    </div>
    <div class="search-container" >
      <el-select v-model="searchSort" class="search-select" placeholder="排序" @change="handleSearch">
        <el-option v-for="item in searchSortOptions" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>

      <button @click="searchAscending = !searchAscending" >{{ searchAscending ? '升序' : '降序' }}</button>
    </div>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      background
      layout="prev, pager, next, jumper"
      class="pagination"
      @current-change="handlePageChanged"
    />


    <!-- 搜索结果 -->
    <template v-if="tableData[0] && ['name', 'platform'].includes(searchTarget)">
      <div class="flex flex-wrap justify-center max-w-200">
        <a v-for="item in tableData" :href="'/song/' + item.id">
          <SearchMusicCard :key="item.id" v-bind="item"/>
        </a>
      </div>
    </template>
    <template v-if="tableData[0] && ['vocalist', 'uploader', 'producer', 'synthesizer'].includes(searchTarget)">
      <SuspendPanel class="flex flex-wrap p-4 gap-2 w-9/10 max-w-112">
        <a v-for="artist in tableData" class="block" :href="`/artist/${searchTarget}/${artist.id}`">
          <el-button>{{ artist.name }}</el-button>
        </a>
      </SuspendPanel>
    </template>

    <button class="btn-primary" @click="expandSearch" id="expand-search" >扩大搜索</button>

    <!-- 分页器 -->
    <el-pagination
      v-model:current-page="page"
      :page-size="pageSize"
      :total="total"
      :pager-count="5"
      background
      layout="prev, pager, next, jumper"
      class="pagination"
      @current-change="handlePageChanged"
    />

  </div>
</template>

<script setup>
import { computed, ref, toRaw } from 'vue';
import router from '../router/index.ts';
import { requester } from '../utils/api/requester.ts';
import SearchMusicCard from '@/components/search/SearchMusicCard.vue';
import { ElSelect, ElOption, ElInput, ElButton, ElPagination } from 'element-plus';
import { useTitle } from '@vueuse/core';
import SuspendPanel from '@/components/container/SuspendPanel.vue';

// 响应式数据
const searchWord = ref('')
const rawData = ref(null)
const searchTarget = ref('name')
const searchSort = ref('default')
const searchAscending = ref(false)
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const loading = ref(false)
const threshold = ref(0.2)

useTitle(computed(() => `搜索：${searchWord.value} | 术力口数据库`))

// 配置项
const searchTargetOptions = [
  { value: 'name', label: '歌名' },
  { value: 'platform', label: '视频' },
  { value: 'producer', label: '作者' },
  { value: 'uploader', label: 'UP主' },
  { value: 'vocalist', label: '歌手' },
  { value: 'synthesizer', label: '引擎' },
]

// 计算属性
const searchSortOptions = computed(() => {
  if (searchType.value === 'song') {
    return [
      { value: 'default', label: '默认' },
      { value: 'view', label: '播放量' },
      { value: 'pubdate', label: '投稿日期' },
      { value: 'count', label: '上榜次数' },
    ];
  } else {
    return [
      { value: 'default', label: '默认' },
      { value: 'count', label: '歌曲数量' },
    ];
  }
})

const tableData = computed(() => {
  return rawData.value?.map(item => formatItem(item)) || []
})

const searchType = computed(() => {
  if (['platform', 'name'].includes(searchTarget.value)) {
    return 'song'
  } else {
    return 'artist'
  }
})


// 方法
const handleSearch = async () => {
  try {
    loading.value = true
    let data
    const options = {
      index: page.value,
      count: pageSize.value,
      threshold: threshold.value,
      sort: searchSort.value
    }
    if (searchTarget.value === 'platform') {
      options.count = 20
      data = await requester.search_song_by_platform(searchWord.value, options)
    } else if (searchTarget.value === 'name') {
      options.count = 20
      data = await requester.search_song_by_name(searchWord.value, options)
    } else {
      options.count = 30
      data = await requester.search_artist(searchTarget.value, searchWord.value, options)
    }

    const { result, total: totalCount } = data
    pageSize.value = options.count

    rawData.value = result
    total.value = totalCount
  } catch (error) {
    console.error('搜索失败:', error)
  } finally {
    loading.value = false
  }
}

const handlePageChanged = async () => {
  await handleSearch();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const formatItem = (data) => (['platform', 'name'].includes(searchTarget.value)
  ? {
    id: data.metadata.id,
    name: data.metadata.name,
    type: data.metadata.type,
    vocalist: data.metadata.target.vocalist.map(v => v.name).join('、'),
    producer: data.metadata.target.producer.map(p => p.name).join('、'),
    thumbnail: data.platform[0].thumbnail
  }
  : data.target)

const expandSearch = async () => {
  threshold.value *= 0.8
  await handleSearch()
}

</script>

<style lang="scss" scoped>
/* 先定义mixin */
@mixin text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 原有基础样式 */

#expand-search {
  margin: 20px;
}


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

img {
  max-width: 100%;
}
.boardpagination {
  display: flex;
  justify-content: center;
  padding: 15px 10px;
}

 .pagination {
  max-width: 100%;
  font-size: 14px;
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
      min-width: 24px;
    }
    :deep(.el-pager li) {
      min-width: 24px;
    }
  }
}
</style>
