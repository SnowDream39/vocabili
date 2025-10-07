<template>
  <div class="ranking-card relative w-full max-w-[474px] overflow-hidden rounded-xl border-2 border-gray-800 text-zinc-800 dark:text-zinc-200  shadow-xl shadow-gray-300 flex flex-col flex-nowrap *:align-self-center"
    style="font-family: '思源黑体', '思源黑体 CN', sans-serif;
  font-weight: 500;">
    <div name="omote" class="z-1 bg-white/50 dark:bg-black/60 text-shadow-md text-shadow-white dark:text-shadow-black">
      <div name="top" class="px-2 pt-2 flex flex-row flex-nowrap">
        <div name="top-left" class="w-12 shrink-1 inline-block m-2 relative" :title="board.target.platform.title">
          <div class="w-12 h-12 text-2xl text-shadow-none font-900 flex justify-center items-center bg-white/20 dark:bg-black/20 backdrop-blur-2 rounded-sm border-1 border-white">{{ board.rank.board }}</div>
          <RankChange :rank-before="board.last ? board.last.rank : 0" :change="change" />
        </div>
        <div name="top-right" class="w-0 grow-3 inline-block m-2 relative *:text-nowrap *:truncate text-shadow-md">
          <div class="text-xl font-bold">{{ board.target.metadata.name }}</div>
          <div>{{ board.target.metadata.target.producer.map(item => item.name).join('、') }}</div>
          <div class="flex flex-row justify-between items-center">
            <div class="text-sm">{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd') }}</div>
            <div class="flex flex-row justify-end gap-4 text-xl text-shadow-none">
              <a :href="board.target.platform.link" target="_blank">
                <div class="i-material-symbols-play-circle-outline-rounded"></div>
              </a>
              <a :href="'/song/' + board.target.metadata.id" target="_blank">
                <div class="i-material-symbols-calendar-month-outline-rounded" >历史数据</div>
              </a>
              <button @click="showData" class="cursor-pointer">
                <div class="i-material-symbols-text-snippet-outline-rounded"></div>
              </button>
              <button @click="showCalculator" class="cursor-pointer">
                <div class="i-material-symbols-calculate-outline-rounded"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div name="bottom" class="flex flex-row flex- justify-center gap-2 items-center text-sm">
        <RankItemMobile icon="i-material-symbols-play-arrow-outline-rounded" :stat="board.change.view" :rank="board.rank.view" :minRank="minRank"/>
        <RankItemMobile icon="i-material-symbols-star-outline-rounded" :stat="board.change.favorite" :rank="board.rank.favorite" :minRank="minRank"/>
        <RankItemMobile icon="i-material-symbols-counter-1-outline-rounded" :stat="board.change.coin" :rank="board.rank.coin" :minRank="minRank"/>
        <RankItemMobile icon="i-material-symbols-thumb-up-outline-rounded" :stat="board.change.like" :rank="board.rank.like" :minRank="minRank"/>
      </div>
    </div>
    <div class="h-full absolute inset-0">
      <img class="w-full h-full object-cover" :src="board.target.platform.thumbnail" alt="thumbnail" />
    </div>

    <el-dialog v-model="dialogVisible" :title="board.target.metadata.name" style="min-width: min(90%, 300px);">
      <RankingDialog :board="board" />

    </el-dialog>

    <el-dialog v-model="calculatorVisible" title="分数计算器" style="min-width: min(90%, 500px);">
      <Calculator v-bind="form" :key="form.view" />
    </el-dialog>
  </div>


</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { Form } from '../song/Calculator.vue';
import type { Board as DataBoard, DataMetadata } from '@/utils/boardData';
import { DateTime } from 'luxon';
import Board from '@/utils/board';
import { compareRank } from '@/utils/dataConverter';
import { ElDialog } from 'element-plus';
import RankItemMobile from './RankItemMobile.vue';
import RankChange from './RankChange.vue';
import RankingDialog from './RankingDialog.vue';
import Calculator from '../song/Calculator.vue';

const props = defineProps<{
  board: DataBoard,
  metadata: DataMetadata,
}>()
const dialogVisible = ref(false)
const calculatorVisible = ref(false)
const form = computed<Form>(() => {
  const { view, favorite, coin, like } = props.board.change
  const copyright = props.board.target.platform.copyright
  const board = new Board(props.metadata.id, Number(props.metadata.issue))
  return { view, favorite, coin, like, copyright, board }
})

const change = ref<string>(compareRank(props.board.rank.board, props.board.last ? props.board.last.rank : undefined))

const minRank = computed(() => {
  return Math.min(props.board.rank.view, props.board.rank.favorite, props.board.rank.coin, props.board.rank.like)
})

function showData() {
  dialogVisible.value = true
}

function showCalculator() {
  calculatorVisible.value = true
}

// 监听 props 的变化，并更新 change
watch(() => props.board.change, () => {
  change.value = compareRank(props.board.rank.board, props.board.last ? props.board.last.rank : undefined);
});

</script>
