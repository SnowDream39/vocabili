<template>
  <template v-for="(artist, index) in artists">
    <el-link
      :href="`/artist/${type}/${artist.id}`"
      target="_blank"
    >{{ artist.name }}</el-link><span v-if="index < artists.length-1">、</span>
  </template>
</template>

<script setup lang="ts">

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