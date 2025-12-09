<template>
  <el-dialog v-if="completed" v-model="visible" >
    <Calculator :form="form" :key="form.board.issue"/>
  </el-dialog>
</template>

<script setup lang="ts">
import Calculator from './Calculator.vue';
import { ref, watch } from 'vue';
import { ElDialog, ElMessage } from 'element-plus';
import { difference, get_video_current_data, type Count } from '@/utils/calculator';
import Board, { isSequentialBoard, type SequentialBoard } from '@/utils/board';
import { DateTime } from 'luxon';
import api from '@/utils/api/api.ts';

const props = defineProps<{
  bvid: string,
  copyright: number,
  boardName: string
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

  const offsetMap: Record<SequentialBoard, number> = {
    'vocaloid-daily': 1,
    'vocaloid-weekly': (DateTime.now().weekday - 6) % 7 + 1,
    "vocaloid-monthly": DateTime.now().day,
  }
  if (!isSequentialBoard(props.boardName))
    throw new Error(`${props.boardName} 不是一个可算分的排行榜`)
  const offset = props.boardName ? offsetMap[props.boardName] : 1
  const historyData = await api.getVideoSnapshot(props.bvid, 1, offset)
  const lastStat: Count = historyData.data[0]

  const stat = difference(currentStat, lastStat)

  if (stat) {
    let {coin, favorite, like, view} = stat
    calculatorVisible.value = true
    form.value = {
      view, favorite, coin, like,
      copyright: props.copyright,
      board: new Board(props.boardName ?? 'vocaloid-daily')
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
