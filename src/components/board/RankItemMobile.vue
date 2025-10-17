<template>
  <div class="flex flex-row flex-nowrap items-center text-sm" :class="highlight ? 'text-red-500' : ''">
    <div :class="icon" class="text-lg"></div>
    <div>{{ stat.toLocaleString() }}</div>
    <div class="i-material-symbols-crown-outline-rounded"></div>
    <div>{{ rank.toLocaleString() }}</div>

  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps<{
  icon: string
  stat: number
  rank: number
  minRank?: number
}>()

const highlight = computed(() => {
  return props.minRank && props.minRank === props.rank
})

</script>
