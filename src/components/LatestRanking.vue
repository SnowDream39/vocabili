<template>
  <div class="w-100 px-2 shrink-0">
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="{name, data} in boardMap" :name="name" :label="name">
        <div v-if="data">
          <ol>
            <li v-for="item in data!.board" class="flex flex-nowrap justify-between items-center h-10 my-2">
              <div class="h-full flex flex-nowrap items-center gap-2">

                <div class="w-8 text-center">{{ item.rank.board }}</div>
                <div v-if="item.rank.board <= 3" class="aspect-ratio-16/9 h-full rounded-md overflow-hidden">
                  <img :src="item.target.platform.thumbnail" referrerpolicy="no-referrer" />
                </div>
                <div>
                  <div>{{ item.target.metadata.name }}</div>
                  <div class="text-sm text-on-surface-variant">{{ item.target.metadata.target.producer.map(item => item.name).join('、') }}</div>
                </div>
              </div>
              <div class="text-sm text-on-surface-variant">{{ item.point.toLocaleString() }} pt</div>
            </li>
          </ol>
          <div class="w-full flex justify-end px-2">
            <ElRouterLink :to="`/board/${data.metadata.id}-${data.metadata.part}`" type="primary">&gt;&gt;更多</ElRouterLink>

          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script setup lang="ts">
import { requester } from '@/utils/api/requester';
import Board from '@/utils/board';
import type { BoardData } from '@/utils/boardData';
import { onMounted, ref } from 'vue';
import { ElTabs, ElTabPane } from 'element-plus';
import ElRouterLink from './misc/ElRouterLink.vue';

const activeName = ref('日刊')
const dailyData = ref<BoardData>()
const weeklyData = ref<BoardData>()
const monthlyData = ref<BoardData>()

const boardMap = ref([
  { name: '日刊', data: dailyData },
  { name: '周刊', data: weeklyData },
  { name: '月刊', data: monthlyData },
])

onMounted(async () => {
  await Promise.all([
    requester.get_board(Board.latest('vocaloid-daily-main'), 10).then(data => { dailyData.value = data } ),
    requester.get_board(Board.latest('vocaloid-weekly-main'), 10).then(data => { weeklyData.value = data } ),
    requester.get_board(Board.latest('vocaloid-monthly-main'), 10).then(data => { monthlyData.value = data } ),
  ])
})

</script>
