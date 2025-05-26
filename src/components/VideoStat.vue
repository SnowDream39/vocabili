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
  </el-table>
  <el-button type="primary" v-if="haveTodayStat" @click="showCalculator" >显示计算器</el-button>
  <el-dialog v-model="calculatorVisible" >
    <Calculator v-bind="form"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue';
import { requester } from '../utils/requester';
import { DateTime } from 'luxon';
import Board, { currentIssue } from '../utils/board';

const calculatorVisible = ref(false)
const haveTodayStat = ref(false)


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

const props = defineProps(['bvid','songId','videoId','copyright'])
const lastStat = ref<Count>({
  view: 0,
  favorite: 0,
  coin: 0,
  like: 0
})
const stat = ref<any>()

const currentStat = ref({
  view: 0,
  favorite: 0,
  coin: 0,
  like: 0
})

const form = computed(() => {

  return {
    ...todayChange.value,
    copyright: props.copyright,
    board: new Board('vocaloid-daily', currentIssue.daily)
  }
})


const todayChange = computed(() => {
  return {
    view: currentStat.value.view - lastStat.value.view,
    favorite: currentStat.value.favorite - lastStat.value.favorite,
    coin: currentStat.value.coin - lastStat.value.coin,
    like: currentStat.value.like - lastStat.value.like,
  }
})


async function get_video_data(bvid: string) {
  const response = await axios.get('https://api.vocabili.top/bilibili/get-video/', {
    params: { bvid },
    
  })
  return response.data
}


async function init() {
  let data = await get_video_data(props.bvid)
  const {view,favorite,coin,like} = data.stat
  currentStat.value = {view,favorite,coin,like}
  data = (await requester.get_video_stat_history(props.videoId, 1, 1, "newset")).result.slice(-1)[0]
  if (data.date == DateTime.local().toFormat('yyyy-MM-dd')) {
    haveTodayStat.value = true
    lastStat.value = data.count
    stat.value = [
      { name:'当前数据', ...currentStat.value},
      { name:'昨日数据', ...lastStat.value},
      { name:'今日增长', ...todayChange.value}
    ]
  } else {
    haveTodayStat.value = false
    stat.value = [
      { name:'当前数据', ...currentStat.value},
    ]
  }
  console.log(data.date)
  console.log(stat.value)


}

function showCalculator() {
  calculatorVisible.value = true
}



onMounted(init)


</script>