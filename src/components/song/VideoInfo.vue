<template>
  <div class="flex flex-col items-center h-[450px]">
    <img :src="video.cover" />
    <div class="flex flex-col flex-nowrap h-60 justify-between items-center">
      <a class="text-xl font-bold text-center" :href="video.link" target="_blank">{{ video.title }}</a>
      <div><ArtistList :artists="song.producer" type="producer" /></div>
      <div><ArtistList :artists="song.vocalist" type="vocalist" /></div>
      <div><ArtistList :artists="song.synthesizer" type="synthesizer" /></div>
      <div><ArtistList :artists="video.uploader" type="uploader" />（{{ video.copyrightString }}）</div>
      <div>{{ video.upload }}</div>
      <div>{{ video.length }}<span v-if="video.page !== 1">/{{ video.page }}P</span></div>
      <button class="btn-primary" @click="showStat">最新数据</button>
    </div>

    <el-dialog
      title="最新数据"
      v-model="statVisible"
      append-to-body
      :modal-append-to-body="false"
      custom-class="video-stats-modal"
      >
      <VideoStat
        :bvid="video.link.split('/').slice(-1)[0]"
        :songId="song.id"
        :videoId="video.id"
        :copyright="video.copyright"
        :upload="video.upload"
      />
    </el-dialog>
  </div>

</template>

<script setup>
import { onMounted, ref } from 'vue';
import { DateTime, Duration } from 'luxon'
import VideoStat from './VideoStat.vue';
import ArtistList from '../search/ArtistList.vue';
const props = defineProps(['song', 'video'])
const statVisible = ref(false)

function showStat() {
  statVisible.value = ! statVisible.value
}

</script>

<style lang="scss" scoped>
.el-carousel {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


img {
  height: 180px;
  width: 320px;
  border-radius: 8px;
  object-fit: cover;
}
:deep(.el-carousel__button) {
  background-color: grey !important;
}

.title {
  display: block;
  margin-top: 10px;
  font-size: 1.2rem;
  color: #1e90ff;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #00aaff;
  }
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}



@media (max-width: 768px) {


  .right {
    max-width: 100%;
  }

  .video {
    width: 100%;
  }

  .title {
    font-size: 1rem;
  }

  ul li {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 0.9rem;
  }

  ul li {
    font-size: 0.8rem;
  }

  .video {
    padding: 10px;
  }
}
</style>
