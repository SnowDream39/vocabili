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
import { requester } from '../../utils/api/requester';
import Board, { currentIssue, type BasicSection } from '../../utils/board';
import { issueNow, startTimeOf } from '../../utils/date';
import { DateTime } from 'luxon';
import { ElTable, ElTableColumn, ElDialog } from 'element-plus';
import Calculator from './Calculator.vue';
import { difference, get_video_current_data, searchData } from '@/utils/calculator';

const props = defineProps(['bvid','songId','videoId','copyright','publish'])

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
    { name:'当前数据', board:'monthly', ...currentStat},
  )

  // 一些历史数据，等一下找一点出来
  const historyData = await requester.get_video_stat_history(props.videoId, 31, 1, "newset")

  const settings = [
    { name:'今日增长', section: 'daily'},
    { name:'本周增长', section: 'weekly'},
    { name:'本月增长', section: 'monthly'}
  ] as {name: string, section: BasicSection}[]

  for (const setting of settings) {
    const startTime = startTimeOf(issueNow()[setting.section], setting.section)

    if (startTime.toMillis() > publishTime.toMillis() ) {
      // 有数据就算，没有就不算。
      const lastStat = searchData(historyData.result, setting.section as BasicSection)

      if (lastStat) {
        const change = difference(currentStat, lastStat)
        stat.value.push({ name: setting.name, board: setting.section, ...change })
      }
    } else {
      stat.value.push({ name: setting.name, board: setting.section, ...currentStat })
    }
  }
}

function showCalculator(row: any) {
  const {coin, favorite, like, view} = row
  calculatorVisible.value = true
  form.value = {
    view, favorite, coin, like,
    copyright: props.copyright,
    board: new Board(`vocaloid-${row.board}`, currentIssue[row.board as keyof typeof currentIssue])
  }
}

onMounted(init)


</script>
