<template>
  <div class="flex flex-wrap flex-row justify-center gap--4">
    <SearchMusicCard v-for="item in data" :key="item.id" v-bind="item" @click="handleDetail(item.id)" />
  </div>
</template>

<script setup lang="ts">
import SearchMusicCard from './SearchMusicCard.vue';

defineProps<{data: any[]}>()

const handleDetail = (id: string) => {
  window.open(`${window.location.origin}/song/${id}`, '_blank')
}

</script>
