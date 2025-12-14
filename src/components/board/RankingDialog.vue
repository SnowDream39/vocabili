<template>
<div class="flex flex-between items-start text-shadow-none">
  <div class="flex-1 self-stretch flex flex-col justify-between">
    <div>
      <div class="text-lg text-center">
        <span>第{{ ranking.rank }}位</span>
        <RankChangeSpan :rank-before="ranking.last?.rank" :change="change" />
      </div>
      <div class="text-center">
        <div class="text-lg">{{ ranking.point.toLocaleString() }} pts</div>
        <div v-if="ranking.last" class="flex flex-row flex-wrap justify-center space-x-2">
          <div>
            上期：{{ ranking.last.point.toLocaleString() }} pts
          </div>
          <div>
            RATE：{{((ranking.point - ranking.last.point) / ranking.last.point * 100).toFixed(2) + '%'}}
          </div>
        </div>
        <div v-if="ranking.seperates[0] > 0">分期排名：{{ ranking.seperates.join('→') }}</div>
      </div>
    </div>

    <div>
      <div class="italic">
        <div><ListItem :items="ranking.song.producers" type="producer" /></div>
        <div><ListItem :items="ranking.song.vocalists" type="vocalist" /></div>
        <div><ListItem :items="ranking.song.synthesizers" type="synthesizer" /></div>
      </div>
      <div class="space-x-2">
        <span>{{ ranking.song.type }}</span>
      </div>
      <div>上榜次数：{{ ranking.count }}</div>
    </div>
  </div>


  <a :href="`/song/${ranking.song.id}`" class="w-50 max-w-1/2">
    <SuspendPanel interact>
      <div class="center-container relative">
        <img class="w-full aspect-video object-cover" :src="ranking.video.thumbnail" alt="thumbnail" />
        <div class="absolute right-0 bottom-0 bg-black/60 font-normal px-1 rounded-tl-sm text-white">
        <span>{{ secondToTime(ranking.video.duration) }}</span>
        <span v-if="ranking.video.page > 1"> / </span>
        <span v-if="ranking.video.page > 1">{{ ranking.video.page }}P</span>
      </div>
      </div>
      <div class="bg-surface-container pb-2">
        <div class="font-900">{{ ranking.video.title }}</div>
        <div>
          <el-link underline="always" :href="`/artist/uploader/${ranking.video.uploader.id}`" >{{ ranking.video.uploader.name }}</el-link>
          <span v-if="[4, 100].includes(ranking.video.copyright)">（搬运）</span>
        </div>
        <div>{{ DateTime.fromISO(ranking.video.pubdate).toFormat('yyyy-LL-dd HH:mm:ss') }}</div>
      </div>
    </SuspendPanel>
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
import type { Ranking } from '@/utils/RankingTypes';
import SuspendPanel from '../container/SuspendPanel.vue';

const props = defineProps<{
  ranking: Ranking
}>()

const change = ref<string>(compareRank(props.ranking.rank, props.ranking.last ? props.ranking.last.rank : undefined))

function secondToTime(seconds: number): string {
  return `${Math.floor(seconds / 60).toString()}:${(seconds % 60).toString().padStart(2, '0')}`
}
</script>
