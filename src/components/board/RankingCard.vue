<template>
  <div
    class="relative max-w-[min(90%,474px)] overflow-hidden rounded-xl border-2 border-gray-800 text-zinc-800 dark:text-zinc-200 text-shadow-md text-shadow-white dark:text-shadow-black shadow-xl shadow-gray-300 grid grid-flow-row gap-4 *:align-self-center"
    style="font-family: '思源黑体', '思源黑体 CN', sans-serif;
  font-weight: 500;">
    <div class="z-1 p-3 bg-white/50 dark:bg-black/70 flex flex-col sm:flex-row flex-wrap justify-center items-center gap-0 sm:gap-4 overflow-hidden ">
      <div name="left" class="w-20 h-20 sm:h-40 flex flex-col flex-wrap justify-center items-center ">
        <div class="justify-center items-center gap-4">
          <div class="w-20 flex-none flex flex-col items-center gap-0 sm:gap-2 z-1">
            <div style="font-size: 300%;">{{ rank }}</div>
            <div class="flex flex-row gap-4">
              <RankChange v-bind="change" />
            </div>
          </div>
          <div class="w-50 inline-block m-4 hidden!" :title="title">
            <el-image class="w-full rounded-xl" :src="image_url + '@400w'" alt="封面" :preview-src-list="[image_url]"
              fit="cover" />
          </div>
        </div>
        <div class="vocal-colors mt-4 w-30 max-h-20 sm:max-h-10 sm:w-20 overflow-hidden whitespace-normal break-words leading-none text-center">
          <span v-for="color in colors" class="text-lg leading-none inline text-shadow-none" :style="{ color: color }">●</span>
        </div>
      </div>
      <div name="right" class="block items-center w-[350px] z-10  ">
        <div class="info-row inline-block w-full text-3xl overflow-hidden text-ellipsis whitespace-nowrap"
          :title="name">{{ name }}</div>
        <div class="w-full grid grid-flow-col grid-cols-[1fr_1fr] grid-rows-[repeat(5,20px)]">
          <InfoItem name="P主" :value="author" />
          <InfoItem name="歌手" :value="vocal" />
          <InfoItem name="类型" :value="type" />
          <InfoItem name="时间" :value="pubdate.slice(0, 16)" />
          <InfoItem name="上榜" :value="String(count)" />
          <InfoItem name="得点" :value="String(point)" />
          <InfoItem name="播放" :value="String(view)" :append="`${view_rank}位`" />
          <InfoItem name="收藏" :value="String(favorite)" :append="`${favorite_rank}位`" />
          <InfoItem name="硬币" :value="String(coin)" :append="`${coin_rank}位`" />
          <InfoItem name="点赞" :value="String(like)" :append="`${like_rank}位`" />
        </div>
        <div class="[&>*]:m-2 [&>*]:text-gray-800!">
          <el-link type="primary" :href="link" target="_blank">视频链接</el-link>
          <el-link type="primary" :href="'/song/' + id" target="_blank">历史数据</el-link>
          <el-link type="primary" @click="showData">详细信息</el-link>
          <el-link type="primary" @click="showCalculator">分数计算器</el-link>
        </div>
      </div>
    </div>

    <div class="h-full absolute inset-0">
      <img class="w-full h-full object-cover" :src="image_url" alt="thumbnail" />
    </div>
  </div>

  <el-dialog v-model="dialogVisible" :title="name" style="min-width: min(90%, 300px);">
    <div class="*:mt-4">
      <div>第{{ rank }}位（{{ change.change === "new" ? "NEW" : `上期${change.rank_before}` }}）</div>
      <div>{{ title }}</div>
      <div style="font-size: small;">P主：{{ author }}
        {{ [1, 4].includes(copyright) ? "本家投稿" : `搬运：${uploader}` }}
        {{ type }}
      </div>
      <div style="font-size: small;">歌手：{{ vocal }}</div>
      <div style="font-size: small;">引擎：{{ synthesizer }}</div>
      <div style="font-size: small;">投稿时间：{{ pubdate }}</div>
      <div>得分：{{ point }}</div>
      <div>上期：{{ point_before }}</div>
      <div>RATE：{{ rate }}</div>
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
import Board from '../../utils/board';
import RankChange from './RankChange.vue';

const props = defineProps<VideoData>()
const dialogVisible = ref(false)
const calculatorVisible = ref(false)
const form = computed<Form>(() => {
  const { view, favorite, coin, like, copyright, board } = props
  return { view, favorite, coin, like, copyright, board }
})

interface VideoData {
  id: string
  title?: string
  link?: string
  name: string
  author: string
  uploader: string
  copyright: 1 | 2 | 3 | 4
  synthesizer: string
  vocal: string
  colors: string[]
  type: "原创" | "翻唱" | "本家重置"
  pubdate: string
  duration: string
  page: number
  view: number
  favorite: number
  coin: number
  like: number
  viewR: string
  favoriteR: string
  coinR: string
  likeR: string
  fixA: string
  fixB: string
  fixC: string
  fix: string
  point: number
  image_url: string
  view_rank: number
  favorite_rank: number
  coin_rank: number
  like_rank: number
  rank: number
  rank_before: number | undefined
  point_before: number | undefined
  rate: string | null
  count: number
  vocal_colors: string[]
  change: "up" | "cont" | "down" | "new"
  board: Board
  issue: number
}


const change = ref({
  change: props.change,
  rank_before: props.rank_before
})

function showData() {
  dialogVisible.value = true
}

function showCalculator() {
  calculatorVisible.value = true
}

// 监听 props 的变化，并更新 change
watch(() => props.change, (newChange) => {
  change.value.change = newChange;
});

watch(() => props.rank_before, (newRankBefore) => {
  change.value.rank_before = newRankBefore;
});


</script>

<style lang="scss" scoped>
// 移动版样式
@media screen and (max-width: 768px) {
  .ranking-card {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-flow: row wrap;
  }


  .info {
    max-width: 100%;
  }
}
</style>
