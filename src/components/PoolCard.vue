<template>
  <CardCoverThumbnail class="w-350px">
    <template #back>
      <img class="w-full h-full object-cover" :src="video.thumbnail" alt="thumbnail" />
    </template>
    <template #front>
      <div class="p-3 flex justify-center items-center gap-4 overflow-hidden cursor-pointer">
        <div name="right" class="block w-full">
          <TextMarquee>
            <div class="inline-block text-2xl whitespace-nowrap" :title="song.name">{{ makeSongName(song) }}</div>
          </TextMarquee>
          <div class="w-full flex">
            <div class="basis-0 grow-2 whitespace-nowrap overflow-hidden">
              <TextMarquee>
                <div>{{song.producers.map(item => item.name).join('、')}}</div>
              </TextMarquee>
              <TextMarquee>
                <div>{{song.vocalists.map(item => item.name).join('、')}}</div>
              </TextMarquee>
              <div>{{ DateTime.fromISO(video.pubdate).toFormat('yyyy-LL-dd HH:mm') }}</div>
            </div>
            <div
              class="basis-0 grow flex flex-col justify-center items-start text-shadow-none  bg-white/70 dark:bg-black/50 rounded-lg overflow-hidden">
              <RankItem icon="i-material-symbols-play-arrow-outline-rounded" :stat="snapshot.view" />
              <RankItem icon="i-material-symbols-star-outline-rounded" :stat="snapshot.favorite" />
              <RankItem icon="i-material-symbols-counter-1-outline-rounded" :stat="snapshot.coin" />
              <RankItem icon="i-material-symbols-thumb-up-outline-rounded" :stat="snapshot.like" />
            </div>
          </div>
          <div class="flex justify-around" @click.stop>
            <a :href="bvidToLink(video.bvid)" target="_blank">
              <button class="glass-button button-lg">
                <div class="i-material-symbols-play-circle-outline-rounded"></div>
              </button>
            </a>
            <router-link :to="'/song/' + song.id">
              <button class="glass-button button-lg">
                <div class="i-material-symbols-calendar-month-outline-rounded"></div>
              </button>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </CardCoverThumbnail>
</template>

<script lang="ts" setup>
import CardCoverThumbnail from '@/components/container/CardCoverThumbnail.vue';
import type { Snapshot, Song, Video } from '@/utils/RankingTypes';
import TextMarquee from './misc/TextMarquee.vue';
import { DateTime } from 'luxon';
import RankItem from './board/RankItem.vue';
import { bvidToLink } from '@/utils/videoid';
import { makeSongName } from '@/utils/displayText';

defineProps<{
  song: Song,
  video: Video,
  snapshot: Snapshot
}>()


// 监听 props 的变化，并更新 change

</script>
