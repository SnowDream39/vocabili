<template>
  <div class="w-full m-4 flex flex-nowrap flex-col justify-center items-center xl:flex-row xl:items-start">
    <!-- 歌曲信息 -->
    <div class="w-full max-w-[600px] mx-10 xl:w-auto xl-basis-lg xl:grow-1 flex flex-col flex-nowrap items-center gap-4" >
      <SongInfo :songId="songId" class="w-full" />
      <CommentFrame class="hidden xl:block" />
    </div>

    <!-- 排行数据 -->
    <div class="w-full px-4 xl:w-auto xl:grow">
      <div v-if="chartCompleted" class="relative">
        <SongChart
          :data="chartMap[chartBoardId].data"
          :board-id="chartBoardId"
          :log="log"
        />
        <div class="absolute top-2 w-full flex justify-between">
          <ElSwitch v-model="log" activeText="对数y轴"/>
          <div>
            <el-button v-if="!chartMap[chartBoardId].end" @click="loadAll(chartBoardId)">加载全部</el-button>
            <el-select
              class="w-30!"
              v-model="chartBoardId"
            >
              <el-option
                v-for="({title, boardId}) in options"
                :key="boardId"
                :value="boardId"
                :label="title"
              />
            </el-select>
          </div>

        </div>
      </div>
    </div>

  </div>
  <CommentFrame class="xl:hidden" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import { useStatusStore } from '@/store/status';
import CommentFrame from '@/components/user/CommentFrame.vue';
import SongInfo from '@/components/song/SongInfo.vue';
import SongChart from '@/components/chart/SongChart.vue';
import { ElSelect, ElOption, ElSwitch, ElButton } from 'element-plus';
import { requester } from '@/utils/api/requester';
const statusStore = useStatusStore()

const options = [
  { title: '日刊数据', boardId: 'vocaloid-daily', },
  { title: '周刊数据', boardId: 'vocaloid-weekly', },
  { title: '月刊数据', boardId: 'vocaloid-monthly', },
]

const songId = ref<string>(initSongId());
const chartCompleted = ref<boolean>(false)
const chartBoardId = ref<string>('vocaloid-daily')
const chartMap = reactive<Record<string, {
  index: number,
  end: boolean,
  data: any
}>>({
  'vocaloid-daily': {index: 0, end: false, data: []},
  'vocaloid-weekly': {index: 0, end: false, data: []},
  'vocaloid-monthly': {index: 0, end: false, data: []},
})
const log = ref<boolean>(false)

function initSongId(){
  const route = useRoute();
  statusStore.articleId = route.params.id as string;
  return route.params.id as string
}

async function fetchData(boardId: string) {
  const chart = chartMap[boardId]
  chart.index += 1;
  const response = await requester.get_song_rank_history(songId.value, boardId, 64, chart.index);
  chart.data.push(...response.result);
  if (chart.index * 64 >= response.total) {
    chart.end = true;
  } else {
    chart.end = false;
  }
}

async function loadAll(boardId: string) {
  const chart = chartMap[boardId]
  chart.end = true
  while (true) {
    chart.index += 1;
    const response = await requester.get_song_rank_history(songId.value, boardId, 64, chart.index);
    chart.data.push(...response.result);
    if (chart.index * 64 >= response.total) {
      break
    }
  }
}

onMounted(async () => {
  await Promise.all([fetchData('vocaloid-daily'), fetchData('vocaloid-weekly'), fetchData('vocaloid-monthly')])
  chartCompleted.value = true
})

</script>


<style scoped>
/* 保证页面没有横向滚动条 */
html,
body {
  margin: 0px;
  padding: 0px;
  overflow-x: hidden;
  /* 禁止水平滚动 */
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
}

/* 表格优化：禁止表格产生水平滚动 */
.el-table {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  /* 保证表格宽度始终自适应 */
}

.el-table-column {
  padding: 12px;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .song-info-container {
    padding: 10px;
    margin-left: 50px;
    margin-right: 50px;
    /* 小屏幕时减少内边距 */
  }

  .board-title {
    font-size: 20px;
    /* 小屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 8px;
    /* 小屏幕时调整表格内边距 */
  }

  .el-table-column {
    padding: 10px;
    /* 小屏幕时调整表格列的内边距 */
  }
}

/* 超小屏幕适配（如手机） */
@media (max-width: 480px) {
  .song-info-container {
    padding: 10px;
    /* 手机屏幕时进一步减小内边距 */
  }

  .board-title {
    font-size: 18px;
    /* 手机屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 5px;
    /* 手机屏幕时减少表格内边距 */
  }

  .el-table-column {
    padding: 8px;
    /* 手机屏幕时调整表格列的内边距 */
  }
}
</style>
