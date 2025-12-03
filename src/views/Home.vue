<template>
  <div class="flex flex-col items-center md:flex-row md:items-start">
    <LatestRanking :today="today" />
    <RankingCalendar :today="today" />
  </div>
</template>

<script setup lang="ts">

import LatestRanking from '@/components/LatestRanking.vue';
import RankingCalendar from '../components/RankingCalendar.vue';
import { DateTime } from 'luxon';
import apiv2 from '@/utils/api/apiv2';
import { onMounted, ref } from 'vue';

const today = ref<DateTime | null>(null);

/**
 * 最新一期是哪天的
 */
async function getToday(): Promise<DateTime> {
  const latestIssue = await apiv2.getLatestRanking('vocaloid-daily')
  return DateTime.local(2024,7,2).plus({days: latestIssue})
}

onMounted(() => {
  getToday().then(date => {
    today.value = date
  })
})
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
