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
          <div class="i-material-symbols-calendar-month-outline-rounded"></div>
        </button>
        </template>
    </el-table-column>
  </el-table>
  <el-dialog v-model="calculatorVisible" >
    <Calculator v-bind="form" :key="form.board.issue"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { onMounted, ref } from 'vue';
import { requester } from '../../utils/api/requester';
import Board, { currentIssue, type BasicSection } from '../../utils/board';
import { issueNow, startTimeOf } from '../../utils/date';
import { DateTime } from 'luxon';

const props = defineProps(['bvid','songId','videoId','copyright','upload'])

interface Count {
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

async function get_video_data(bvid: string) {
  const response = await axios.get('https://api.vocabili.top/bilibili/get-video/', {
    params: { bvid },

  })
  return response.data
}

function difference(currentStat: Count, lastStat: Count): Count {
  return {
    view: currentStat.view - lastStat.view,
    favorite: currentStat.favorite - lastStat.favorite,
    coin: currentStat.coin - lastStat.coin,
    like: currentStat.like - lastStat.like,
  }
}

function searchData(historyData: {date: string, count: Count}[], section: BasicSection): Count | null {
  // history 里面的日期是那天0点数据的意思
  const date = startTimeOf(issueNow()[section], section)
  if (date.isValid) {
    const data = historyData.find((item: any) => item.date === date.toFormat('yyyy-MM-dd'))
    if (data) {
      return data.count
    }
    return null
  } else {
    throw new Error(`Invalid DateTime: ${date.invalidExplanation || "Unknown reason"}`);
  }
}


/*
 *
 */
async function init() {
  const publishTime = DateTime.fromFormat(props.upload, 'yyyy-MM-dd hh:mm:ss')
  stat.value = []

  // 当前数据
  let data = await get_video_data(props.bvid)
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
