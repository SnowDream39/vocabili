<template>
  <CardCoverThumbnail class="max-w-[474px]">
    <template #front v-if="!isMobile">
      <div class="p-3 flex justify-center items-center gap-4 overflow-hidden ">
        <div name="left" class="w-20 h-40 flex flex-col flex-wrap justify-center items-center ">
          <div class="justify-center items-center gap-4">
            <div class="w-20 flex-none flex flex-col items-center gap-2 z-1">
              <div class="current-rank text-[300%]">{{ board.rank.board }}</div>
              <div class="flex flex-row gap-4">
                <RankChange :rank-before="board.last ? board.last.rank : 0" :change="change" />
              </div>
            </div>
          </div>
        </div>
        <div name="right" class="block items-center w-[350px]">
          <div class="info-row inline-block w-full text-3xl overflow-hidden text-ellipsis whitespace-nowrap"
            :title="board.target.metadata.name">{{ board.target.metadata.name }}</div>
          <div class="w-full flex" >
            <div class="basis-0 grow-2 whitespace-nowrap overflow-hidden">
              <div>{{ board.target.metadata.target.producer.map(item => item.name).join('、') }}</div>
              <div>{{ board.target.metadata.target.vocalist.map(item => item.name).join('、') }}</div>
              <div>{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm') }}</div>
              <div>
                <span>{{ board.point.toLocaleString() }}pts</span>
                <span> / </span>
                <span>{{ board.count.toLocaleString() }}回</span>
              </div>
            </div>
            <div class="basis-0 grow flex flex-col justify-center items-start text-shadow-none  bg-white/70 dark:bg-black/50 rounded-lg overflow-hidden">
              <RankItem icon="i-material-symbols-play-arrow-outline-rounded" :stat="board.change.view" :rank="board.rank.view" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-star-outline-rounded" :stat="board.change.favorite" :rank="board.rank.favorite" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-counter-1-outline-rounded" :stat="board.change.coin" :rank="board.rank.coin" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-thumb-up-outline-rounded" :stat="board.change.like" :rank="board.rank.like" :minRank="minRank"/>
            </div>
          </div>
          <div class="flex justify-around">
            <a :href="board.target.platform.link" target="_blank">
              <button class="glass-button button-lg" ><div class="i-material-symbols-play-circle-outline-rounded"></div></button>
            </a>
            <a :href="'/song/' + board.target.metadata.id" target="_blank">
              <button class="glass-button button-lg" ><div class="i-material-symbols-calendar-month-outline-rounded"></div></button>
            </a>
            <button class="glass-button button-lg" @click="showData"><div class="i-material-symbols-text-snippet-outline-rounded"></div></button>
            <button class="glass-button button-lg" @click="showCalculator"><div class="i-material-symbols-calculate-outline-rounded"></div></button>
          </div>
        </div>
      </div>
    </template>
    <template #front>
      <div name="top" class="px-2 pt-2 flex flex-row flex-nowrap">
        <div name="top-left" class="w-12 shrink inline-block m-2 relative" :title="board.target.platform.title">
          <div class="w-12 h-12 text-2xl text-shadow-none font-900 flex justify-center items-center bg-white/20 dark:bg-black/20 backdrop-blur-2 rounded-sm border border-white">{{ board.rank.board }}</div>
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
        <RankItem icon="i-material-symbols-play-arrow-outline-rounded" :stat="board.change.view" :rank="board.rank.view" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-star-outline-rounded" :stat="board.change.favorite" :rank="board.rank.favorite" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-counter-1-outline-rounded" :stat="board.change.coin" :rank="board.rank.coin" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-thumb-up-outline-rounded" :stat="board.change.like" :rank="board.rank.like" :minRank="minRank"/>
      </div>
    </template>
    <template #back>
      <img class="w-full h-full object-cover" :src="board.target.platform.thumbnail" alt="thumbnail" />
    </template>
    <el-dialog v-model="dialogVisible" :title="board.target.metadata.name">
      <RankingDialog :board="board" />
    </el-dialog>

    <el-dialog v-model="calculatorVisible" title="分数计算器" :width="250" >
      <Calculator v-model="form" :key="form.view" />
    </el-dialog>
  </CardCoverThumbnail>



</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { Form } from '../song/Calculator.vue';
import RankChange from './RankChange.vue';
import Calculator from '../song/Calculator.vue';
import RankItem from './RankItem.vue';
import type { Board as DataBoard, DataMetadata } from '@/utils/boardData';
import { DateTime } from 'luxon';
import Board from '@/utils/board';
import { compareRank } from '@/utils/dataConverter';
import { ElDialog } from 'element-plus';
import RankingDialog from './RankingDialog.vue';
import CardCoverThumbnail from './CardCoverThumbnail.vue';
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 640px)')
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
