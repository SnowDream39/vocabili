<template>
  <h1 class="text-2xl font-bold">{{ artistName }}</h1>
  <div>歌曲数：{{ total }}</div>
  <a v-for="item in artistSongs" class="flex flex-wrap flex-row justify-center gap-4" :href="'/song/' + item.id">
    <SearchSongCard :key="item.id" :song="item"/>
  </a>
  <el-pagination
    background
    layout="prev, pager, next"
    :page-size="10"
    :total="total"
    :pager-count="5"
    v-model:current-page="page"
    @current-change="searchSong"
  />
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useTitle } from '@vueuse/core';
import api from '@/utils/api/api';
import type { SongWithVideos } from '@/utils/RankingTypes';
import SearchSongCard from '@/components/search/SearchSongCard.vue';
import { ElPagination } from 'element-plus';


const route = useRoute()
const artistName = ref('')
const page = ref(1)
const total = ref(0)
const artistSongs = ref<SongWithVideos[]>([])
const artistType = route.params.type as string
const artistId = route.params.id as string
useTitle(computed(() => artistName.value + ' | 术力口数据库'))

async function searchSong() {
  const data = await api.getArtistSongList(artistType, artistId, page.value, 10)
  total.value = data.total
  artistSongs.value = data.data
}

async function fetchArtistInfo() {
  const data = await api.getArtistInfo(artistType, artistId)
  artistName.value = data.data.name
}


onMounted(async () => {
  await searchSong()
  await fetchArtistInfo()
})

</script>

<style>
</style>
