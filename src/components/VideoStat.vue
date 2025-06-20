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
          <el-button
            type="primary"
            size="small"
            :icon="InfoFilled"
            @click="showCalculator(row)"
          />
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
import { requester } from '../utils/requester';
import { DateTime } from 'luxon';
import Board, { currentIssue } from '../utils/board';
import { InfoFilled } from '@element-plus/icons-vue'

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

/*
 *
 */
async function init() {
  stat.value = []
  const uploadTime = DateTime.fromFormat(props.upload, 'yyyy-MM-dd HH:mm:ss')
  const today = DateTime.local().startOf('day')

  // 当前数据
  let data = await get_video_data(props.bvid)
  const {view,favorite,coin,like} = data.stat
  const currentStat = {view,favorite,coin,like}
  stat.value.push(
    { name:'当前数据', board:'monthly', ...currentStat},
  )

  // 0时数据
  data = (await requester.get_video_stat_history(props.videoId, 1, 1, "newset")).result.slice(-1)[0]
  let settings = []

  if (data.date == DateTime.local().toFormat('yyyy-MM-dd')) {
    //  今天有数据
    settings.push(
      { name:'今日增长', sinceTime: today, board: 'daily', days: 1},
      { name:'本周增长', sinceTime: today.minus({days: (today.weekday-6+7)%7}), board: 'weekly', days: (DateTime.local().weekday -5+7)%7},
      { name:'本月增长', sinceTime: today.minus({days: today.day-1}), board: 'monthly', days: (DateTime.local().day)}
    )
  } else {
    //  今天没有数据，这意味着API获取的数据是多退了一天的，所以需要减去1天
    if ( DateTime.local().weekday == 6) {
      // 今天是周六，没有周六数据，那就不要本周数据
    } else {
      settings.push({ name:'本周增长', sinceTime: today.minus({days: (today.weekday-6+7)%7}), board: 'weekly', days: (DateTime.local().weekday -6+7)%7})
    }

    if ( DateTime.local().day == 1) {
      // 今天是1号，没有1号数据，那就不要本月数据
    } else {
      settings.push({ name:'本月增长', sinceTime: today.minus({days: today.day-1}), board: 'monthly', days: (DateTime.local().day -1)})
    }
  }
  for (const setting of settings) {
    data = (await requester.get_video_stat_history(props.videoId, 1, setting.days, 'newset')).result.slice(-1)
    if (data.length) {
      const lastStat: Count = data[0].count
      const change = difference(currentStat, lastStat)
      stat.value.push({ name: setting.name, board: setting.board, ...change })
    } else {
      // 说明那个时候歌曲尚未投稿或者未收录。验证一下投稿日期
      if (uploadTime.toMillis() > setting.sinceTime.toMillis()) {
        stat.value.push({ name: setting.name, board: setting.board, ...currentStat })
      }
    }
  }
}

function showCalculator(row: any) {
  console.log(row)
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
