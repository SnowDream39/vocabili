<template>
  <el-dialog v-if="completed" v-model="visible" >
    <Calculator :form="form" :key="form.board.issue"/>
  </el-dialog>
</template>

<script setup lang="ts">
import { requester } from '@/utils/api/requester';
import Calculator from './Calculator.vue';
import { ref, watch } from 'vue';
import { ElDialog, ElMessage } from 'element-plus';
import { difference, get_video_current_data, type Count } from '@/utils/calculator';
import Board, { type BasicSection } from '@/utils/board';
import { DateTime } from 'luxon';

const props = defineProps<{
  bvid: string,
  videoId: string,
  copyright: number,
  section?: string
}>()

const visible = defineModel<boolean>({
  required: true
})

const completed = ref<boolean>(false)

const form = ref<any>()
const calculatorVisible = ref(false)

async function init() {
  // 当前数据
  let data = await get_video_current_data(props.bvid)
  let {view,favorite,coin,like} = data.stat
  const currentStat: Count = {view,favorite,coin,like}

  const offsetMap: Record<BasicSection, number> = {
    daily: 1,
    weekly: (DateTime.now().weekday - 6) % 7 + 1,
    monthly: DateTime.now().day,
  }
  const offset = props.section ? offsetMap[props.section as BasicSection] : 1
  console.log(offset)
  const historyData = await requester.get_video_stat_history(props.videoId, 1, offset, "newset")
  const lastStat: Count = historyData.result[0].count

  const stat = difference(currentStat, lastStat)

  if (stat) {
    let {coin, favorite, like, view} = stat
    calculatorVisible.value = true
    form.value = {
      view, favorite, coin, like,
      copyright: props.copyright,
      board: new Board(props.section ? `vocaloid-${props.section}` : 'vocaloid-daily')
    }
  }

  completed.value = true
}

watch(() => visible.value, (value: boolean) => {
  if (value && !completed.value) {
    ElMessage({
      message: '正在加载中',
      type: 'primary',
      offset: 66
    })
    void init()
  }
})

</script>
