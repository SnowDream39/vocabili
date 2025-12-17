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

      <el-select v-model="searchTarget" class="search-select" placeholder="搜索类型">
        <el-option v-for="item in searchTargetOptions" :key="item.value" :value="item.value" :label="item.label" />
      </el-select>
    </div>
    <div class="search-container" >
      <el-select v-model="searchSort" class="search-select" placeholder="排序">
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
    <template v-if="searchData && searchData.type == 'song'">
      <div class="flex flex-wrap justify-center w-4/5 min-w-75">
        <a v-for="item in searchData.data" :href="'/song/' + item.id">
          <SearchSongCard :key="item.id" :song="item"/>
        </a>
      </div>
    </template>
    <template v-if="searchData && searchData.type == 'video'">
      <div class="flex flex-wrap justify-center w-4/5 min-w-75">
        <router-link v-for="item in searchData.data" :to="'/song/' + item.song.id">
          <SearchVideoCard :key="item.bvid" :video="item"/>
        </router-link>
      </div>
    </template>
    <template v-if="searchData && searchData.type == 'artist'">
      <SuspendPanel class="flex flex-wrap p-4 gap-2 w-9/10 max-w-112">
        <div v-for="artist in searchData.data" class="block w-full">
          <SearchArtistRow :key="artist.id" :type="searchTarget" :artist="artist"/>
        </div>
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

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import SearchSongCard from '@/components/search/SearchSongCard.vue';
import SearchVideoCard from '@/components/search/SearchVideoCard.vue';
import SearchArtistRow from '@/components/search/SearchArtistRow.vue';
import { ElSelect, ElOption, ElInput, ElPagination } from 'element-plus';
import { useTitle } from '@vueuse/core';
import SuspendPanel from '@/components/container/SuspendPanel.vue';
import api from '@/utils/api/api.ts';
import type { SongWithVideos, Uploader, VideoWithSong } from '@/utils/RankingTypes';

// 响应式数据
const searchWord = ref('')
const searchData = ref<{
  type: 'song',
  data: SongWithVideos[],
} | {
  type: 'video',
  data: VideoWithSong[],
} | {
  type: 'artist',
  data: Uploader[],
}>()
const searchTarget = ref('song')
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
  { value: 'song', label: '歌名' },
  { value: 'video', label: '视频' },
  { value: 'producer', label: '作者' },
  { value: 'uploader', label: 'UP主' },
  { value: 'vocalist', label: '歌手' },
  { value: 'synthesizer', label: '引擎' },
]

// 计算属性
const searchSortOptions = computed(() => {
  if (searchTarget.value === 'song') {
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



// 方法
const handleSearch = async () => {
  try {
    loading.value = true
    let result
    if (searchTarget.value === 'video') {
      result = await api.search('video', searchWord.value, page.value, pageSize.value)
      searchData.value = {
        type: 'video',
        data: result.data
      }
    } else if (searchTarget.value === 'song') {
      result = await api.search('song', searchWord.value, page.value, pageSize.value)
      searchData.value = {
        type: 'song',
        data: result.data
      }
    } else {
      result = await api.search(searchTarget.value, searchWord.value, page.value, pageSize.value)
      searchData.value = {
        type: 'artist',
        data: result.data
      }
    }

    console.log('搜索结果:', toRaw(searchData.value))

    total.value = result.total
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
