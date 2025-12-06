<template>
  <div class="w-full flex flex-nowrap flex-col justify-center items-center">
    <!-- 歌曲信息 -->
    <div v-loading="loading" class="w-full my-4 center-container" >
      <SongInfoBlock :songId="songId" @completed="loading = false" />
    </div>

    <!-- 排行数据 -->
    <div class="w-full px-4">
      <div v-loading="!chartCompleted" class="relative">
        <SongChart
          :data="chartMap[chartBoardId].data"
          :board-name="chartBoardId"
          :log="log"
          ref="chartRef"
        />
        <div class="absolute top-2 w-full flex justify-between">
          <ElSwitch v-model="log" activeText="对数y轴"/>
          <div>
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
        <div class="w-full flex justify-end">
          <el-button v-if="!chartMap[chartBoardId].end" @click="loadAll(chartBoardId)">加载全部</el-button>
          <el-button @click="showTable">导出表格</el-button>
        </div>
      </div>
      <SongHistoryTableData
        v-if="tableVisible"
        :data="tableData"
      />
    </div>

  </div>
  <CommentFrame />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, reactive, ref } from 'vue';
import { useStatusStore } from '@/store/status';
import CommentFrame from '@/components/user/CommentFrame.vue';
import SongInfoBlock from '@/components/song/SongInfoBlock.vue';
import SongChart from '@/components/chart/SongChart.vue';
import { ElSelect, ElOption, ElSwitch, ElButton } from 'element-plus';
import SongHistoryTableData from '@/components/song/SongHistoryTableData.vue';
import api from '@/utils/api/api';
import type { Ranking } from '@/utils/RankingTypes';
import type { SequentialBoard } from '@/utils/board';

const statusStore = useStatusStore()

const options = [
  { title: '日刊数据', boardId: 'vocaloid-daily', },
  { title: '周刊数据', boardId: 'vocaloid-weekly', },
  { title: '月刊数据', boardId: 'vocaloid-monthly', },
]

const songId = ref<number>(initSongId());
const chartCompleted = ref<boolean>(false)
const chartBoardId = ref<SequentialBoard>('vocaloid-daily')
const chartMap = reactive<Record<string, {
  index: number,
  end: boolean,
  data: Ranking[]
}>>({
  'vocaloid-daily': {index: 0, end: false, data: []},
  'vocaloid-weekly': {index: 0, end: false, data: []},
  'vocaloid-monthly': {index: 0, end: false, data: []},
})
const chartRef = ref<any>()
const tableVisible = ref<boolean>(false)
const tableData = ref<any>()
const log = ref<boolean>(false)
const loading = ref<boolean>(true)

function initSongId(){
  const route = useRoute();
  statusStore.articleId = route.params.id as string;
  return Number(route.params.id) as number
}

async function fetchData(board: SequentialBoard) {
  const chart = chartMap[board]
  chart.index += 1;
  const response = await api.getSongRanking(songId.value, board);
  chart.data.push(...response.data);
  if (chart.index * 64 >= response.total) {
    chart.end = true;
  } else {
    chart.end = false;
  }
  if (!chartCompleted.value) {
    chartBoardId.value = board
    chartCompleted.value = true
  }
}

async function loadAll(boardId: string) {
  const chart = chartMap[boardId]
  chart.end = true
  while (true) {
    chart.index += 1;
    const response = await api.getSongRanking(songId.value, boardId, chart.index, 64);
    chart.data.push(...response.result);
    if (chart.index * 64 >= response.total) {
      break
    }
  }
}

function showTable() {
  const option = chartRef.value?.getOption()
  const slider = option.dataZoom.filter((item: any) => item.type == 'slider')[0]
  const { startValue, endValue } = slider as unknown as any
  tableData.value = chartMap[chartBoardId.value].data.filter((item: any) => item.issue >= startValue && item.issue <= endValue)
  tableVisible.value = true
}

onMounted(async () => {
  await Promise.all([fetchData('vocaloid-daily'), fetchData('vocaloid-weekly'), fetchData('vocaloid-monthly')])
  chartBoardId.value = 'vocaloid-daily'
})

</script>


