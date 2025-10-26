<template>
  <template v-for="(artist, index) in artists">
    <el-link
      underline="always"
      :href="`/artist/${type}/${artist.id}`"
    >{{ artist.name }}</el-link><span v-if="index < artists.length-1">、</span>
  </template>
</template>

<script setup lang="ts">
import { ElLink } from 'element-plus';
interface Artist {
  id: string,
  name: string,
  color?: number
}

defineProps<{
  type: string,
  artists: Artist[]
}>()

</script>
