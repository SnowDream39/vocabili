<template>
  <CardCoverThumbnail class="max-w-[300px]">
    <template #back>
      <img class="w-full h-full object-cover" :src="image_url" alt="thumbnail" />
    </template>
    <template #front>
      <div class="p-2">
        <div class="info">
          <div class="info-row info-title" :title="name">{{ name }}<span v-for="color in colors" :style="{ color: color }">●</span></div>
          <div class="info-detail">
            <InfoItem name="P主" :value="author" />
            <InfoItem name="歌手" :value="vocal" />
            <InfoItem name="类型" :value="type" />
            <InfoItem name="日期" :value="pubdate.slice(0,10)" />
            <InfoItem name="播放" :value="view.toLocaleString()"/>
            <InfoItem name="收藏" :value="favorite.toLocaleString()" />
            <InfoItem name="硬币" :value="coin.toLocaleString()"/>
            <InfoItem name="点赞" :value="like.toLocaleString()"/>
          </div>
          <div class="flex justify-around">
            <a :href="link">
              <button class="glass-button button-lg" ><div class="i-material-symbols-play-circle-outline-rounded"></div></button>
            </a>
            <a :href="'/song/' + id">
              <button class="glass-button button-lg" ><div class="i-material-symbols-calendar-month-outline-rounded"></div></button>
            </a>
          </div>
        </div>
      </div>

    </template>
  </CardCoverThumbnail>
</template>

<script lang="ts" setup>
import InfoItem from '@/components/board/InfoItem.vue';
import CardCoverThumbnail from '@/components/container/CardCoverThumbnail.vue';
defineProps<VideoData>()

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
  image_url: string
  rank: number
  vocal_colors: string[]
}


// 监听 props 的变化，并更新 change

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
  border-radius: 12px;
  border: #e4e4e4 1px solid;
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
  grid-template-rows: repeat(4, 20px);
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
