<template>
  <h1 class="big-title">前五列表</h1>
  <ElSelect v-model="board" placeholder="选择榜单">
    <ElOption v-for="option of options" :label="option.label" :value="option.value"/>
  </ElSelect>
  <ElTable :data="tableData" v-if="tableData.length > 0">
    <ElTableColumn prop="issue" label="期数"/>
    <ElTableColumn v-for="rank of [0,1,2,3,4]" :key="rank" :label="rank+1">
      <template #default="{row}">
        <ElImage :src="row.songs[rank].thumbnail" />
      </template>
    </ElTableColumn>
  </ElTable>
  <ElPagination
    v-if="tableData.length > 0"
    layout="prev, pager, next, sizes, jumper"
    :pager-count="5"
    :total="currentIssue"
    v-model:page-size="size"
    :page-sizes="[5,10,20]"
    @size-change="getData"
    @current-change="getData"
    v-model:current-page="page"
  />
</template>


<script lang="ts" setup>
import { requester } from '@/utils/api/requester';
import Board from '@/utils/board';
import { useTitle } from '@vueuse/core';
import { ElPagination, ElSelect, ElTable } from 'element-plus';
import { onMounted, ref } from 'vue';

useTitle('前五列表 | 术力口数据库')
interface IssueData {
  issue: number;
  songs: any[];
}

const options = [
  { label: '日刊', value: 'vocaloid-daily' },
  { label: '周刊', value: 'vocaloid-weekly' },
  { label: '月刊', value: 'vocaloid-monthly' }
]

const tableData = ref<IssueData[]>([])
const board = ref<string>('vocaloid-weekly')
const page = ref<number>(1)
const currentIssue = ref<number>(0)
const size = ref<number>(5)

function makeData(data: any[]): IssueData[]  {
  const newData: IssueData[] = []
  for (const d of data) {
    newData.push({
      issue: Number(d.metadata.issue),
      songs: d.board.map((song: any) => ({
        thumbnail: song.target.platform.thumbnail
      }))
    })
  }
  return newData;
}

async function getData() {
  console.log(page.value)
  let data = await requester.get_board(new Board(`${board.value}-main`, -1), undefined, 1)
  currentIssue.value = data.metadata.issue
  let issues: number[] = Array.from({length: size.value}, (_, i) => currentIssue.value - (page.value - 1) * size.value - i).filter(n => n > 0)

  data = await requester.get_boards(board.value, "main", issues, size.value)
  tableData.value = makeData(data)
}


onMounted(async () => {
  await getData()
})

</script>
