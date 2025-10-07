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
      <div name="right" class="block items-center w-[350px] z-10">
        <div class="info-row inline-block w-full text-3xl overflow-hidden text-ellipsis whitespace-nowrap"
          :title="board.target.metadata.name">{{ board.target.metadata.name }}</div>
        <div class="w-full flex" >
          <div class="basis-0 grow-2 whitespace-nowrap overflow-hidden">
            <div>{{ board.target.metadata.target.producer.map(item => item.name).join('、') }}</div>
            <div>{{ board.target.metadata.target.vocalist.map(item => item.name).join('、') }}</div>
            <div>{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm') }}</div>
            <div>
              <span>{{ board.point }}pts</span>
              <span> / </span>
              <span>{{ board.count }}回</span>
            </div>
          </div>
          <div class="basis-0 grow-1 flex flex-col justify-center items-start text-shadow-none  bg-white/70 dark:bg-black/50 rounded-lg overflow-hidden">
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

    <div class="h-full absolute inset-0">
      <img class="w-full h-full object-cover" :src="board.target.platform.thumbnail" alt="thumbnail" />
    </div>

    <el-dialog v-model="dialogVisible" :title="board.target.metadata.name" style="min-width: min(90%, 300px);">
      <div class="flex flex-between text-shadow-none">
        <div class="flex-1 self-stretch flex flex-col justify-between">
          <div>
            <div class="text-lg text-center">
              <span>第{{ board.rank.board }}位</span>
              <RankChangeSpan :rank-before="board.last?.rank" :change="change" />
            </div>
            <div class="text-center">
              <div class="text-lg">{{ board.point }} pts</div>
              <div v-if="board.last">
                <span>
                  上期：{{ board.last.point }}
                </span>
                <span>
                  RATE：{{((board.point - board.last.point) / board.last.point * 100).toFixed(2) + '%'}}
                </span>
              </div>
            </div>
          </div>

          <div>
            <div class="italic">
              <div><ListItem :items="board.target.metadata.target.producer" type="producer" /></div>
              <div><ListItem :items="board.target.metadata.target.vocalist" type="vocalist" /></div>
              <div><ListItem :items="board.target.metadata.target.synthesizer" type="synthesizer" /></div>
            </div>
            <div class="space-x-2">
              <span v-if="[1, 4].includes(board.target.platform.copyright)">本家投稿</span>
              <span v-else>搬运</span>
              <span>{{ board.target.metadata.type }}</span>
            </div>
            <div>上榜次数：{{ board.count }}</div>
          </div>
        </div>


        <a :href="`/song/${board.target.metadata.id}`" target="_blank" class="w-50 self-start rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
          <img class="w-full" :src="board.target.platform.thumbnail" alt="thumbnail" />
          <div class="bg-zinc-200 pb-2">
            <div class="font-900">{{ board.target.platform.title }}</div>
            <el-link :href="`/artist/uploader/${board.target.platform.uploader[0].id}`" >{{ board.target.platform.uploader[0].name }}</el-link>
            <div>{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm:ss') }}</div>
          </div>
        </a>
      </div>

    </el-dialog>

    <el-dialog v-model="calculatorVisible" title="分数计算器" :width="250" >
      <Calculator v-bind="form" :key="form.view" />
    </el-dialog>
  </div>


</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import type { Form } from '../song/Calculator.vue';
import RankChange from './RankChange.vue';
import RankChangeSpan from './RankChangeSpan.vue';
import ListItem from './ListItem.vue';
import Calculator from '../song/Calculator.vue';
import RankItem from './RankItem.vue';
import type { Board as DataBoard, DataMetadata } from '@/utils/boardData';
import { DateTime } from 'luxon';
import Board from '@/utils/board';
import { compareRank } from '@/utils/dataConverter';
import { ElLink, ElDialog } from 'element-plus';

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
