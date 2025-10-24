<template>
  <div v-if="data">
    <h2>{{ data.name }} <span v-for="color in data.color" :style="{ color: color }">●</span></h2>
    <el-carousel
      height="450px"
      :autoplay="!statVisible"
      :interval="5000"
      :arrow="data.length === 1 ? 'never' : 'always'"
    >
      <el-carousel-item class="video" v-for="video of data" :key="video.video.link">
        <VideoInfo v-bind="video"></VideoInfo>
      </el-carousel-item>
    </el-carousel>
  </div>
  <div v-else>
    <div>加载中</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DateTime, Duration } from 'luxon'
import VideoInfo from './VideoInfo.vue';
import { requester } from '@/utils/api/requester';
import { ElCarousel, ElCarouselItem } from 'element-plus';
async function fetchSongInfo(songId: string) {
  try {
    const data = await requester.get_song_info(songId);
    return data[0];
  } catch (error) {
    console.log('获取数据失败：', error);
    return null;
  }
}

// 不处理为最终文本
function converted(data: any) {
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
    color: vocalist.map((item: any) => '#' + item.color.toString(16).toUpperCase().padStart(6, "0")),
    producer,
    synthesizer,
    videos
  }
  return plainData
}

function toVideosData(plainData: any) {
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

const props = defineProps(['songId'])

const data = ref<any>()
const statVisible = ref(false)


watch(() => props.songId, async () => {
  if (props.songId) {

    const originalData = await fetchSongInfo(props.songId)
    const plainData = converted(originalData)
    const videosData = toVideosData(plainData)
    data.value = videosData
  }
})

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

ul li {
  margin: 5px 0;
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
