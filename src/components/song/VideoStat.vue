<template>
  <el-table
    :data="stat"
  >
    <el-table-column
      v-for="column in columns"
      :key="column.key"
      :label="column.label"
      :prop="column.key"
    />
    <el-table-column
      key="operation"
      label="计算器"
    >
      <template #default="{ row }">
        <button class="btn-primary" @click="showCalculator(row)" >
          <div class="i-material-symbols-calculate-outline-rounded"></div>
        </button>
        </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="calculatorVisible" >
    <Calculator :form="form" :key="form.board.issue"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Board, { currentIssue, type SequentialBoard } from '../../utils/board';
import { issueNow, startTimeOf } from '../../utils/date';
import { DateTime } from 'luxon';
import { ElTable, ElTableColumn, ElDialog } from 'element-plus';
import Calculator from './Calculator.vue';
import { difference, get_video_current_data, searchData } from '@/utils/calculator';
import api from '@/utils/api/api';

const props = defineProps<{
  bvid: string,
  songId: number,
  copyright: number,
  publish: string
}>()



interface DataRow {
  name: string,
  board: SequentialBoard,
  view: number,
  favorite: number,
  coin: number,
  like: number
}


const columns = [
  {key: "name", label: "数据"},
  {key: "view", label: "播放"},
  {key: "favorite", label: "收藏"},
  {key: "coin", label: "硬币"},
  {key: "like", label: "点赞"},
]

const stat = ref<any[]>()
const form = ref<any>()
const calculatorVisible = ref(false)

// ==================== 函数 =============================


/*
 *
 */
async function init() {
  const publishTime = DateTime.fromISO(props.publish)
  stat.value = []

  // 当前数据
  let data = await get_video_current_data(props.bvid)
  const {view,favorite,coin,like} = data.stat
  const currentStat = {view,favorite,coin,like}
  stat.value.push(
    { name:'当前数据', board:'vocaloid-monthly', ...currentStat},
  )

  // 一些历史数据，等一下找一点出来
  const historyData = await api.getVideoSnapshot(props.bvid, 1, 31)

  const settings: {name: string, board: SequentialBoard}[] = [
    { name:'今日增长', board: 'vocaloid-daily'},
    { name:'本周增长', board: 'vocaloid-weekly'},
    { name:'本月增长', board: 'vocaloid-monthly'}
  ]

  for (const setting of settings) {
    const startTime = startTimeOf(issueNow()[setting.board], setting.board)
    console.log(startTime.toFormat('yyyy-MM-dd'))

    if (startTime.toMillis() > publishTime.toMillis() ) {
      // 有数据就算，没有就不算。
      const lastStat = searchData(historyData.data, setting.board)

      if (lastStat) {
        const change = difference(currentStat, lastStat)
        stat.value.push({ name: setting.name, board: setting.board, ...change })
      }
    } else {
      stat.value.push({ name: setting.name, board: setting.board, ...currentStat })
    }
  }
}

function showCalculator(row: DataRow) {
  const {coin, favorite, like, view} = row
  calculatorVisible.value = true
  form.value = {
    view, favorite, coin, like,
    copyright: props.copyright,
    board: new Board(row.board, 'main', currentIssue[row.board])
  }
}

onMounted(init)


</script>
