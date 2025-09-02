<template>
  <div class="bg-zinc-50 shadow-lg md:flex md:flex-row md:items-start">
    <NoticeBoard />
    <RankingCalendar />
  </div>
</template>

<script setup lang="ts">
import NoticeBoard from '@/components/NoticeBoard.vue';
import RankingCalendar from '../components/RankingCalendar.vue';

</script>
<style lang="scss" scoped>
.info {
  width: 100%;
  padding: 40px 0px 40px 0px;
  background-color: rgba(255, 255, 255, 0.8);
  text-align: center;
  box-sizing: border-box;
  font-size: large;
}
</style>
