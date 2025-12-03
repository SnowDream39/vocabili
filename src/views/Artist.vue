<template>
  <h1 class="text-2xl font-bold">{{ artistName }}</h1>
  <div>歌曲数：{{ total }}</div>
  <a v-for="item in artistSongs" class="flex flex-wrap flex-row justify-center gap-4" :href="'/song/' + item.id">
    <SearchMusicCard :key="item.id" v-bind="item"/>
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


const route = useRoute()
const artistName = ref('')
const page = ref(1)
const total = ref(0)
const artistSongs = ref<any[]>([])

useTitle(computed(() => artistName.value + ' | 术力口数据库'))


const {type,id} = route.params as { type: string; id: string };



function converted(data: any) {
  const {metadata,platform} = data;
  const {id,name,type,target:artist} = metadata;
  const {vocalist,producer,synthesizer} = artist;
  const {title,thumbnail} = platform[0]

  const plainData = {
    id,name,type,
    vocalist: vocalist.map((item: any) => item.name).join('、'),
    producer: producer.map((item: any) => item.name).join('、'),
    synthesizer: synthesizer.map((item: any) => item.name).join('、'),
    thumbnail,title
  }
  return plainData
}


async function searchSong() {
  const data = await api.getSongList(type, id, page.value, 10)
  total.value = data.total
  artistSongs.value = data.result.map((item: any) => converted(item))
}

async function fetchArtistInfo() {
  const data = await api.getArtistInfo(type, id)
  artistName.value = data[0].name
}


onMounted(async () => {
  await searchSong()
  await fetchArtistInfo()
})

</script>

<style>
</style>
