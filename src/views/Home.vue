<template>
  <div class="flex flex-col items-center md:flex-row md:items-start">
    <LatestRanking />
    <RankingCalendar />
  </div>
</template>

<script setup lang="ts">

import LatestRanking from '@/components/LatestRanking.vue';
import RankingCalendar from '../components/RankingCalendar.vue';

</script>
<style scoped>
.info {
  width: 100%;
  padding: 40px 0px 40px 0px;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  box-sizing: border-box;
  font-size: large;
}
</style>
