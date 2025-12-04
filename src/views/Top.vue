<template>
  <h1 class="big-title">前五列表</h1>
  <ElSelect v-model="board" placeholder="选择榜单">
    <ElOption v-for="option of options" :label="option.label" :value="option.value"/>
  </ElSelect>
  <div id="top5-table" class="grid grid-cols-6">
    <template v-for="issueData in data">
      <div>{{ issueData.issue }}</div>
      <div v-for="item in issueData.rankings">
        <img :src="item.video.thumbnail" alt="thumbnail">
      </div>
    </template>
  </div>
  <ElPagination
    v-if="data.length > 0"
    layout="prev, pager, next, sizes, jumper"
    :pager-count="5"
    :total="total"
    v-model:page-size="size"
    :page-sizes="[5,10,20]"
    @size-change="getData"
    @current-change="getData"
    v-model:current-page="page"
  />
</template>


<script lang="ts" setup>
import api from '@/utils/api/api';
import type { Ranking } from '@/utils/RankingTypes';
import { useTitle } from '@vueuse/core';
import { ElPagination, ElSelect } from 'element-plus';
import { onMounted, ref } from 'vue';

useTitle('前五列表 | 术力口数据库')
interface IssueData {
  issue: number;
  rankings: Ranking[];
}

const options = [
  { label: '日刊', value: 'vocaloid-daily' },
  { label: '周刊', value: 'vocaloid-weekly' },
  { label: '月刊', value: 'vocaloid-monthly' }
]

const data = ref<IssueData[]>([])
const board = ref<string>('vocaloid-')
const page = ref<number>(1)
const size = ref<number>(5)
const total = ref<number>(0)

async function getData() {
  console.log(page.value)
  let result = await api.getRankingTop5(board.value, 'main', page.value, size.value)
  data.value = result.data
  total.value = result.total
}


onMounted(async () => {
  await getData()
})

</script>
