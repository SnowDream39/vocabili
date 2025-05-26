<template>
  <h2>{{ data.name }} <span v-for="color in data.color" :style="{ color: color }">●</span></h2>
    <el-carousel 
      height="480px" 
      :autoplay="!statVisible"
      interval="5000"
      :arrow="data.length === 1 ? 'never' : 'always'" 
    >
      <el-carousel-item class="video" v-for="video of data" :key="video.video.link">
        <VideoInfo v-bind="video"></VideoInfo>
      </el-carousel-item>
    </el-carousel>
</template>

<script setup>
import { defineProps, onMounted, ref } from 'vue';
import { DateTime, Duration } from 'luxon'

// 不处理为最终文本
function converted(data) {
  const { metadata, platform } = data
  const { id, name, type, target: staff } = metadata
  const { vocalist, producer, synthesizer } = staff
  const videos = []
  for (const pf of platform) {
    const { id, link, page, title, publish, uploader, thumbnail, duration, copyright } = pf
    videos.push({
      id,
      uploader,
      link,
      page,
      title,
      cover: thumbnail,
      length: Duration.fromMillis(duration * 1000).toFormat("m分s秒"),
      upload: DateTime.fromISO(publish).toFormat("yyyy-MM-dd HH:mm:ss"),
      copyright,
      copyrightString: [1, 4].includes(copyright) ? "本家" : "搬运"

    })
  }
  const plainData = {
    id,
    name,
    type,
    vocalist,
    color: vocalist.map(item => '#' + item.color.toString(16).toUpperCase().padStart(6, "0")),
    producer,
    synthesizer,
    videos
  }
  return plainData
}

function toVideosData(plainData) {
  let videosData = [];
  for (let i in plainData.videos) {
    let songData = Object.assign({}, plainData);
    delete songData.videos;
    let videoData = plainData.videos[i];
    videosData.push({
      song: songData,
      video: videoData
    })
  }
  return videosData;
}

const props = defineProps(['metadata', 'platform'])
const plainData = converted(props)
const videosData = toVideosData(plainData)
const data = ref(videosData)
const statVisible = ref(false)

function showStat() {
  statVisible.value = ! statVisible.value
}

</script>

<style lang="scss" scoped>

.song-info {
  max-width: 90%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px; /* Add gap between items */
  padding: 20px 0;
}

.el-carousel {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.video {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 15px;
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  img {
    height: 180px;
    width: 320px;
    border-radius: 8px;
    object-fit: cover;
  }

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

ul li {
  margin: 5px 0;
}

.el-button {
  margin-top: 10px;
}

@media (max-width: 768px) {
  .song-info {
    flex-direction: column;
    padding: 15px;
  }

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
