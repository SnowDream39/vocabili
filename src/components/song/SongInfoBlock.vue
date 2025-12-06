<template>
  <div v-if="song" class="max-w-full">
    <!-- 待实现：在这里做左右移动按钮 -->
      <el-scrollbar>
        <div class="flex flex-nowrap gap-4 pt-1 pl-4 pb-4">
          <div id="song-info" class="grow-0 shrink-0 w-60 *:my-2">
            <h1 class="font-800 text-3xl text-left">{{ song.name }}</h1>
            <div><ArtistList :artists="song.producers" type="producer" /></div>
            <div><ArtistList :artists="song.vocalists" type="vocalist" /></div>
            <div><ArtistList :artists="song.synthesizers" type="synthesizer" /></div>
          </div>
          <div class="flex gap-4 items-stretch">
            <SuspendPanel interact v-for="(video, index) in song.videos" class="grow-0 shrink-0 w-60 flex flex-col">
              <div class="grow-0 shrink-0 aspect-ratio-16/9 w-full overflow-hidden">
                <img :src="video.thumbnail" />
              </div>
              <div class="grow flex flex-col justify-between">
                <a class="font-bold underline underline-offset-5 hover:no-underline" :href="bvidToLink(video.bvid)">{{ video.title }}</a>
                <div>
                  <div>
                    <div><ArtistList :artists="[video.uploader]" type="uploader" /><span v-if="[2, 3, 101].includes(video.copyright)">（搬运）</span></div>
                    <div>{{ DateTime.fromISO(video.pubdate).toFormat('yyyy-LL-dd HH:mm:ss') }}</div>
                  </div>
                  <div class="w-30 grow-0 shrink-0">
                    <el-button type="primary" @click="showStat(index)">最新数据</el-button>
                  </div>
                </div>
              </div>
              <el-dialog
                title="最新数据"
                v-model="statVisible[index]"
                append-to-body
                :modal-append-to-body="false"
                custom-class="video-stats-modal"
                >
                <VideoStat
                  :bvid="video.bvid"
                  :songId="song.id"
                  :copyright="video.copyright"
                  :publish="video.pubdate"
                />
              </el-dialog>
            </SuspendPanel>
          </div>

        </div>
      </el-scrollbar>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { DateTime } from 'luxon'
import { useTitle } from '@vueuse/core';
import ArtistList from '../search/ArtistList.vue';
import { ElDialog, ElScrollbar, ElButton } from 'element-plus';
import VideoStat from './VideoStat.vue';
import SuspendPanel from '../container/SuspendPanel.vue';
import api from '@/utils/api/api';
import type { SongWithVideos } from '@/utils/RankingTypes';
import { bvidToLink } from '@/utils/videoid';
// ==============  处理数据  ==============
const song = ref<SongWithVideos>()
const statVisible = ref<boolean[]>([])
const emits = defineEmits(['completed'])

function showStat(index: number) {
  statVisible.value[index] = ! statVisible.value[index]
}


async function fetchSongInfo(songId: number): Promise<SongWithVideos> {

  const data = await api.getSong(songId);
  return data.data;

}


const props = defineProps(['songId'])

useTitle(computed(() => {
  if (song.value) {
    return song.value.name + ' | 术力口数据库'
  } else {
    return '加载中……'
  }
}))

onMounted(async () => {
  if (props.songId) {
    song.value = await fetchSongInfo(props.songId)
    emits('completed')
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
