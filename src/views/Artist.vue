<template>
  <h1>{{ artistName }}</h1>
  <SearchSongTable if="artistSongs[0]" :data="artistSongs"  />
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
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { requester } from '../utils/requester';
import SearchSongTable from '../components/SearchSongTable.vue';


const route = useRoute()
const artistName = ref('')
const page = ref(1)
const total = ref(0)
const artistSongs = ref([])



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
  const data = await requester.get_song_list(type, id, page.value, 10)
  total.value = data.total
  artistSongs.value = data.result.map((item: any) => converted(item))
}


onMounted(async () => {
  await searchSong()
})

</script>

<style>
</style>