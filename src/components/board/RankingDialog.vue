<template>
<div class="flex flex-between text-shadow-none">
  <div class="flex-1 self-stretch flex flex-col justify-between">
    <div>
      <div class="text-lg text-center">
        <span>第{{ board.rank.board }}位</span>
        <RankChangeSpan :rank-before="board.last?.rank" :change="change" />
      </div>
      <div class="text-center">
        <div class="text-lg">{{ board.point.toLocaleString() }} pts</div>
        <div v-if="board.last" class="flex flex-row flex-wrap justify-center space-x-2">
          <div>
            上期：{{ board.last.point.toLocaleString() }} pts
          </div>
          <div>
            RATE：{{((board.point - board.last.point) / board.last.point * 100).toFixed(2) + '%'}}
          </div>
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


  <a :href="`/song/${board.target.metadata.id}`" target="_blank" class="w-50 max-w-1/2 self-start rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all">
    <div class="center-container relative">
      <img class="w-full aspect-video object-cover" :src="board.target.platform.thumbnail" alt="thumbnail" />
      <div class="absolute right-0 bottom-0 bg-black/60 font-normal px-1 rounded-tl-sm text-white">
      <span>{{ secondToTime(board.target.platform.duration) }}</span>
      <span v-if="board.target.platform.page > 1"> / </span>
      <span v-if="board.target.platform.page > 1">{{ board.target.platform.page }}P</span>
    </div>
    </div>
    <div class="bg-surface-container pb-2">
      <div class="font-900">{{ board.target.platform.title }}</div>
      <el-link underline="always" :href="`/artist/uploader/${board.target.platform.uploader[0].id}`" >{{ board.target.platform.uploader[0].name }}</el-link>
      <div>{{ DateTime.fromISO(board.target.platform.publish).toFormat('yyyy-LL-dd HH:mm:ss') }}</div>
    </div>
  </a>
</div>
</template>

<script setup lang="ts">
import { compareRank } from '@/utils/dataConverter';
import { DateTime } from 'luxon'
import { ref } from 'vue';
import RankChangeSpan from './RankChangeSpan.vue';
import ListItem from './ListItem.vue';
import { ElLink } from 'element-plus';
import type { Board } from '@/utils/boardData';

const props = defineProps<{
  board: Board
}>()

const change = ref<string>(compareRank(props.board.rank.board, props.board.last ? props.board.last.rank : undefined))

function secondToTime(seconds: number): string {
  return `${Math.floor(seconds / 60).toString()}:${(seconds % 60).toString().padStart(2, '0')}`
}
</script>
