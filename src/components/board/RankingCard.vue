<template>
  <CardCoverThumbnail class="max-w-[474px]">
    <template #front v-if="!isMobile">
      <div class="p-3 flex justify-center items-center gap-4 overflow-hidden cursor-pointer "  @click="showData">
        <div name="left" class="w-20 h-40 flex flex-col flex-wrap justify-center items-center "  >
          <div class="justify-center items-center gap-4">
            <div class="w-20 flex-none flex flex-col items-center gap-2 z-1">
              <div class="current-rank text-[300%]">{{ song.rank }}</div>
              <div class="flex flex-row gap-4">
                <RankChange :rank-before="song.last ? song.last.rank : 0" :change="change" />
              </div>
            </div>
          </div>
        </div>
        <div name="right" class="block items-center w-[350px]">
            <TextMarquee>
              <div class="inline-block text-3xl whitespace-nowrap"
                :title="song.song.name">{{ song.song.name }}</div>
            </TextMarquee>
          <div class="w-full flex" >
            <div class="basis-0 grow-2 whitespace-nowrap overflow-hidden">
              <TextMarquee>
                <div>{{ song.song.producers.map(item => item.name).join('、') }}</div>
              </TextMarquee>
              <TextMarquee>
              <div>{{ song.song.vocalists.map(item => item.name).join('、') }}</div>
              </TextMarquee>
              <div>{{ DateTime.fromISO(song.video.pubdate).toFormat('yyyy-LL-dd HH:mm') }}</div>
              <div>
                <span>{{ song.point.toLocaleString() }}pts</span>
                <span> / </span>
                <span>{{ song.count }}回</span>
              </div>
            </div>
            <div class="basis-0 grow flex flex-col justify-center items-start text-shadow-none  bg-white/70 dark:bg-black/50 rounded-lg overflow-hidden">
              <RankItem icon="i-material-symbols-play-arrow-outline-rounded" :stat="song.view" :rank="song.view_rank" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-star-outline-rounded" :stat="song.favorite" :rank="song.favorite_rank" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-counter-1-outline-rounded" :stat="song.coin" :rank="song.coin_rank" :minRank="minRank"/>
              <RankItem icon="i-material-symbols-thumb-up-outline-rounded" :stat="song.like" :rank="song.like_rank" :minRank="minRank"/>
            </div>
          </div>
          <div class="flex justify-around" @click.stop >
            <a :href="bvidToLink(song.bvid)" target="_blank">
              <button class="glass-button button-lg" ><div class="i-material-symbols-play-circle-outline-rounded"></div></button>
            </a>
            <a :href="'/song/' + song.song_id">
              <button class="glass-button button-lg" ><div class="i-material-symbols-calendar-month-outline-rounded"></div></button>
            </a>
            <button class="glass-button button-lg" @click="showCalculator"><div class="i-material-symbols-calculate-outline-rounded"></div></button>
            <button v-if="props.isToday" class="glass-button button-lg" @click="showToday"><div class="i-material-symbols-today-rounded"></div></button>
          </div>
        </div>
      </div>
    </template>
    <template #front v-else>
      <div name="top" class="px-2 pt-2 flex flex-row flex-nowrap cursor-pointer"  @click="showData" >
        <div name="top-left" class="w-12 shrink inline-block m-2 relative" :title="song.video.title">
          <div class="w-12 h-12 text-2xl text-shadow-none font-900 flex justify-center items-center bg-white/20 dark:bg-black/20 backdrop-blur-2 rounded-sm border border-white">{{ song.rank }}</div>
          <RankChange :rank-before="song.last ? song.last.rank : 0" :change="change" />
        </div>
        <div name="top-right" class="w-0 grow-3 inline-block m-2 relative *:text-nowrap *:truncate text-shadow-md">
          <TextMarquee>
            <div class="inline-block text-xl whitespace-nowrap"
              :title="song.song.name">{{ song.song.name }}</div>
          </TextMarquee>
          <TextMarquee>
            <div>{{ song.song.producers.map(item => item.name).join('、') }}</div>
          </TextMarquee>
          <div class="flex flex-row justify-between items-center">
            <div class="text-sm">{{ DateTime.fromISO(song.video.pubdate).toFormat('yyyy-LL-dd') }}</div>
            <div class="flex flex-row justify-end gap-4 text-xl text-shadow-none"  @click.stop >
              <a :href="bvidToLink(song.bvid)" target="_blank">
                <div class="i-material-symbols-play-circle-outline-rounded"></div>
              </a>
              <a :href="'/song/' + song.song_id">
                <div class="i-material-symbols-calendar-month-outline-rounded" >历史数据</div>
              </a>
              <button @click="showCalculator">
                <div class="i-material-symbols-calculate-outline-rounded"></div>
              </button>
              <button v-if="props.isToday" @click="showToday">
                <div class="i-material-symbols-today-rounded"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div name="bottom" class="flex flex-row flex- justify-center gap-2 items-center text-sm">
        <RankItem icon="i-material-symbols-play-arrow-outline-rounded" :stat="song.view" :rank="song.view_rank" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-star-outline-rounded" :stat="song.favorite" :rank="song.favorite_rank" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-counter-1-outline-rounded" :stat="song.coin" :rank="song.coin_rank" :minRank="minRank"/>
        <RankItem icon="i-material-symbols-thumb-up-outline-rounded" :stat="song.like" :rank="song.like_rank" :minRank="minRank"/>
      </div>
    </template>
    <template #back>
      <img class="w-full h-full object-cover" :src="song.video.thumbnail" alt="thumbnail" />
    </template>

  </CardCoverThumbnail>

  <el-dialog v-model="dialogVisible" :title="song.song.name">
    <RankingDialog :ranking="song" />
  </el-dialog>

  <el-dialog v-model="calculatorVisible" title="分数计算器" :width="250" >
    <Calculator :form="form" :key="form.view" />
  </el-dialog>

  <TodayCalculator
    v-model="todayCalculatorVisible"
    :board-name="props.boardName ?? 'vocaloid-daily'"
    :bvid="song.bvid"
    :video-id="song.bvid"
    :copyright="song.video.copyright"
    :key="song.bvid"
  />

</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { Form } from '../song/Calculator.vue';
import RankChange from './RankChange.vue';
import Calculator from '../song/Calculator.vue';
import RankItem from './RankItem.vue';
import { DateTime } from 'luxon';
import { compareRank } from '@/utils/dataConverter';
import { ElDialog } from 'element-plus';
import RankingDialog from './RankingDialog.vue';
import CardCoverThumbnail from '@/components/container/CardCoverThumbnail.vue';
import { useMediaQuery } from '@vueuse/core';
import TodayCalculator from '../song/TodayCalculator.vue';
import TextMarquee from '../misc/TextMarquee.vue';
import type Board from '@/utils/board';
import type { Ranking } from '@/utils/RankingTypes';
import { bvidToLink } from '@/utils/videoid';

const isMobile = useMediaQuery('(max-width: 640px)')
const props = defineProps<{
  song: Ranking,
  board: Board,
  isToday?: boolean,
  boardName?: string
}>()
const dialogVisible = ref(false)
const calculatorVisible = ref(false)
const todayCalculatorVisible = ref(false)
const form = computed<Form>(() => {
  const { view, favorite, coin, like } = props.song
  const copyright = props.song.video.copyright
  const board = props.board
  return { view, favorite, coin, like, copyright, board }
})

const change = ref<string>()
const minRank = computed(() => {
  return Math.min(props.song.view_rank, props.song.favorite_rank, props.song.coin_rank, props.song.like_rank)
})
function showData() {
  dialogVisible.value = true
}

function showCalculator() {
  calculatorVisible.value = true
}

function showToday() {
  todayCalculatorVisible.value = true
}

// 监听 props 的变化，并更新 change
watch(() => props.song, () => {
  change.value = compareRank(props.song.rank, props.song.last ? props.song.last.rank : undefined);
}, {immediate: true});

</script>
