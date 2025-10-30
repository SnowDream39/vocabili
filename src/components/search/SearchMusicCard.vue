<template>
  <CardCoverThumbnail v-motion-slide-visible-bottom class="w-77 h-32 m-1 border-2 border-solid border-black">
    <template #front>
      <div class="m-1">
        <div class="h-7 flex flex-row justify-between items-center">
          <div>{{ vocalist }}</div>
        </div>
        <div class="h-12 flex flex-col justify-around">
          <div class="w-full text-xl font-bold">{{ name }}</div>
        </div>
        <div class="h-7 flex flex-row justify-between items-center">
          <div>{{ producer }}</div>
        </div>
      </div>
    </template>
    <template #back>
      <img class="back-thumbnail w-full h-full object-cover"
          :src="thumbnail" alt="thumbnail" />
    </template>
  </CardCoverThumbnail>
</template>

<script setup lang="ts">
import CardCoverThumbnail from '../board/CardCoverThumbnail.vue';

defineProps<{
  producer: string;
  vocalist: string;
  name: string;
  thumbnail: string;
}>();

</script>
