<template>
  <CardCoverThumbnail class="w-77 h-32 m-1 border-2 border-solid border-black">
    <template #front>
      <div class="m-1">
        <TextMarquee>
          <div class="h-7 flex flex-row justify-between items-center whitespace-nowrap">
            <div>{{ song.vocalists.map(v => v.name).join('、') }}</div>
          </div>
        </TextMarquee>
        <TextMarquee>
        <div class="h-12 flex flex-col justify-around">
          <div class="w-full text-xl font-bold">{{ makeSongName(song) }}</div>
        </div>
        </TextMarquee>
        <TextMarquee>
        <div class="h-7 flex flex-row justify-between items-center">
          <div>{{ song.producers.map(p => p.name).join('、') }}</div>
        </div>
        </TextMarquee>
      </div>
    </template>
    <template #back v-if="song.videos.length">
      <img class="back-thumbnail w-full h-full object-cover"
          :src="song.videos[0].thumbnail" alt="thumbnail" />
    </template>
  </CardCoverThumbnail>
</template>

<script setup lang="ts">
import CardCoverThumbnail from '@/components/container/CardCoverThumbnail.vue';
import TextMarquee from '../misc/TextMarquee.vue';
import type { SongWithVideos } from '@/utils/RankingTypes';
import { makeSongName } from '@/utils/displayText';

defineProps<{
  song: SongWithVideos
}>();

</script>
