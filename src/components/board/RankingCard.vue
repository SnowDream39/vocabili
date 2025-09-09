<template>
  <div class="ranking-card relative max-w-[474px] overflow-hidden rounded-xl border-2 border-gray-800 text-zinc-800 dark:text-zinc-200 text-shadow-md text-shadow-white dark:text-shadow-black shadow-xl shadow-gray-300 grid grid-flow-row gap-4 *:align-self-center"
    style="font-family: '思源黑体', '思源黑体 CN', sans-serif;
  font-weight: 500;">
    <div class="z-1 p-3 bg-white/50 dark:bg-black/70 flex flex-col sm:flex-row! flex-nowrap justify-center items-center gap-0 sm:gap-4 overflow-hidden ">
      <div name="left" class="w-20 h-20 sm:h-40 flex flex-col flex-wrap justify-center items-center ">
        <div class="justify-center items-center gap-4">
          <div class="w-20 flex-none flex flex-col items-center gap-0 sm:gap-2 z-1">
            <div class="current-rank text-[300%]">{{ board.rank.board }}</div>
            <div class="flex flex-row gap-4">
              <RankChange :rank-before="board.last ? board.last.rank : 0" :change="change" />
            </div>
          </div>
          <div class="w-50 inline-block m-4 hidden!" :title="board.target.platform.title">
            <el-image class="w-full rounded-xl" :src="board.target.platform.thumbnail + '@400w'" alt="封面" :preview-src-list="[board.target.platform.thumbnail]"
              fit="cover" />
          </div>
        </div>
        <div class="vocal-colors mt-4 w-30 max-h-20 sm:max-h-10 sm:w-20 overflow-hidden whitespace-normal break-words leading-none text-center">
          <span v-for="color in []" class="text-lg leading-none inline text-shadow-none" :style="{ color: color }">●</span>
        </div>
      </div>
      <div name="right" class="block items-center w-[350px] z-10  ">
        <div class="info-row inline-block w-full text-3xl overflow-hidden text-ellipsis whitespace-nowrap"
          :title="board.target.metadata.name">{{ board.target.metadata.name }}</div>
        <div class="w-full grid grid-flow-col grid-cols-[1fr_1fr] grid-rows-[repeat(5,20px)]">
          <InfoItem name="P主" :value="board.target.metadata.target.producer.map(item => item.name).join('、')" />
          <InfoItem name="歌手" :value="board.target.metadata.target.vocalist.map(item => item.name).join('、')" />
          <InfoItem name="类型" :value="board.target.metadata.type" />
          <InfoItem name="时间" :value="DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm')" />
          <InfoItem name="上榜" :value="String(board.count)" />
          <InfoItem name="得点" :value="String(board.point)" />
          <InfoItem name="播放" :value="String(board.change.view)" :append="`${board.rank.view}位`" />
          <InfoItem name="收藏" :value="String(board.change.favorite)" :append="`${board.rank.favorite}位`" />
          <InfoItem name="硬币" :value="String(board.change.coin)" :append="`${board.rank.coin}位`" />
          <InfoItem name="点赞" :value="String(board.change.like)" :append="`${board.rank.like}位`" />
        </div>
        <div class="[&>*]:m-2 [&>*]:text-gray-800!">
          <el-link type="primary" :href="board.target.platform.link" target="_blank">视频链接</el-link>
          <el-link type="primary" :href="'/song/' + board.target.metadata.id" target="_blank">历史数据</el-link>
          <el-link type="primary" @click="showData">详细信息</el-link>
          <el-link type="primary" @click="showCalculator">分数计算器</el-link>
        </div>
      </div>
    </div>

    <div class="h-full absolute inset-0">
      <img class="w-full h-full object-cover" :src="board.target.platform.thumbnail" alt="thumbnail" />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="board.target.metadata.name" style="min-width: min(90%, 300px);">
    <div class="*:mt-4">
      <div>第{{ board.rank.board }}位（{{ change === "new" ? "NEW" : `上期${props.board.last ? props.board.last.rank : ''}` }}）</div>
      <div>{{ board.target.platform.title }}</div>
      <div class="text-sm *:mr-1">
        <span>P主：<ListItem :items="board.target.metadata.target.producer" type="producer" /></span>
        <span v-if="[1, 4].includes(board.target.platform.copyright)">本家投稿</span>
        <span v-else>搬运：<el-link>{{ board.target.platform.uploader[0].name }}</el-link></span>
        <span>{{ board.target.metadata.type }}</span>
      </div>
      <div class="text-sm">歌手：<ListItem :items="board.target.metadata.target.vocalist" type="vocalist" /></div>
      <div class="text-sm">引擎：<ListItem :items="board.target.metadata.target.synthesizer" type="synthesizer" /></div>
      <div class="text-sm">投稿时间：{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm:ss') }}</div>
      <div>得分：{{ board.point }}</div>
      <div>上期：{{ board.last?.point }}</div>
      <div>RATE：{{ board.last ? ((board.point - board.last.point) / board.last.point * 100).toFixed(2) + '%' : '' }}</div>
    </div>

  </el-dialog>

  <el-dialog v-model="calculatorVisible" title="分数计算器" style="min-width: min(90%, 500px);">
    <Calculator v-bind="form" :key="form.view" />
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import InfoItem from './InfoItem.vue';
import type { Form } from '../song/Calculator.vue';
import RankChange from './RankChange.vue';
import ListItem from './ListItem.vue';
import type { Board as DataBoard, DataMetadata } from '@/utils/boardData';
import { DateTime } from 'luxon';
import Board from '@/utils/board';
import { compareRank } from '@/utils/dataConverter';

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
