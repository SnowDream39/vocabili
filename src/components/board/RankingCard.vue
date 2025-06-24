<template>
  <div class="ranking-card shadow-box">
    <div class="portrait">
      <div class="rank">
        <div style="font-size: 300%;">{{ rank }}</div>
        <div class="rank-change">
          <RankChange v-bind="change" />
        </div>
      </div>
      <div class="image-container" :title="title">
        <el-image
          class="cover-image"
          :src="image_url + '@400w'"
          alt="封面"
          :preview-src-list="[image_url]"
          fit="cover"
        />
      </div>
    </div>
    <div class="info">
      <div class="info-row info-title" :title="name">{{ name }}<span v-for="color in colors" :style="{ color: color }">●</span></div>
      <div class="info-detail">
        <InfoItem name="P主" :value="author" />
        <InfoItem name="歌手" :value="vocal" />
        <InfoItem name="类型" :value="type" />
        <InfoItem name="时间" :value="pubdate.slice(0,16)" />
        <InfoItem name="上榜" :value="String(count)" />
        <InfoItem name="得点" :value="String(point)" />
        <InfoItem name="播放" :value="String(view)" :append="`${view_rank}位`"/>
        <InfoItem name="收藏" :value="String(favorite)" :append="`${favorite_rank}位`"/>
        <InfoItem name="硬币" :value="String(coin)" :append="`${coin_rank}位`"/>
        <InfoItem name="点赞" :value="String(like)" :append="`${like_rank}位`"/>
      </div>
      <div class="info-row">
        <el-link type="primary" :href="link" target="_blank">视频链接</el-link>
        <el-link type="primary" :href="'/song/' + id" target="_blank">历史数据</el-link>
        <el-link type="primary" @click="showData" >详细信息</el-link>
        <el-link type="primary" @click="showCalculator" >分数计算器</el-link>
      </div>
    </div>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="name"
    style="min-width: min(90%, 300px);"
  >
    <div class="dataDialog">
      <div>第{{ rank }}位（{{ change.change === "new" ? "NEW" : `上期${change.rank_before}`}}）</div>
      <div>{{ title }}</div>
      <div style="font-size: small;">P主：{{ author }}
        {{ [1,4].includes(copyright) ? "本家投稿" : `搬运：${uploader}` }}
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

  <el-dialog
    v-model="calculatorVisible"
    title="分数计算器"
    style="min-width: min(90%, 500px);"
  >
  <Calculator v-bind="form" :key="form.view"/>
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
  const {view, favorite, coin, like, copyright, board} = props
  return {view, favorite, coin, like, copyright, board}
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
* {
  font-size: 15px;
}

.ranking-card {
  position: relative;
  box-sizing: border-box;
  max-width: 90%;
  margin: 10px 0; /* 添加卡片之间的间距 */
  padding: 20px;
  background: #fff;
  border-radius: 12px;
  border: #e4e4e4 1px solid;
  color: #455670;
  font-family: "思源黑体", "思源黑体 CN", sans-serif;
  font-weight: 500;

  display: grid;
  grid-auto-flow: column;
  // grid-auto-columns: max-content;
  gap: 10px;

  & > * {
    align-self: center;
  }
}

.portrait {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  gap: 10px;


  .rank {
    flex: 0 0 80px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .rank-change {
      display: flex;
      flex-direction: row;
      gap: 10px;
    }

  }

  .image-container {
    width: 200px;
    display: inline-block;
    margin: 10px;

    .cover-image {
      width: 100%;
      border-radius: 12px;
    }

  }

}




.info {
  display: block;
  align-items: center;
  width: 350px;
}

.info-row {
  .el-link {
    margin: 5px 5px;
    color: #8a8a8a;
  }
}

.info-title {
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-size: 30px;
}

.info-detail {
  width: 100%;
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(5, 20px);
}

.dataDialog {
  * {
    margin-top: 10px;
  }
}


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
