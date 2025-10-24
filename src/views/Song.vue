<template>
  <div class="w-full m-4 flex flex-nowrap flex-col justify-center items-center xl:flex-row xl:items-start">
    <!-- 歌曲信息 -->
    <div class="w-full max-w-[600px] mx-10 xl:w-auto xl-basis-lg xl:grow-1 flex flex-col flex-nowrap items-center gap-4" >
      <SongInfo :songId="songId" class="w-full" />
      <CommentFrame class="hidden xl:block" />
    </div>

    <!-- 排行数据 -->
    <div class="max-w-full">
      <div class="relative">
        <SongChart v-if="chartData" :data="chartData" />
        <div class="absolute top-4 w-full flex justify-center">
          <el-select
            class="w-30!"
            v-model="chartBoardId"
            @change="selectChart"
          >
            <el-option
              v-for="{title, boardId} of options"
              :key="boardId"
              :value="boardId"
              :label="title"
            />
          </el-select>
        </div>
      </div>

      <template v-for="option of options">
        <h3 class="text-xl font-bold m-y-4">{{ option.title }}</h3>
        <SongHistoryTable :songId="songId" :boardId="option.boardId" class="rounded-xl" @send-data="handleData" />
      </template>
    </div>

  </div>
  <CommentFrame class="xl:hidden" />
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import { onMounted, ref } from 'vue';
import { useStatusStore } from '@/store/status';
import SongHistoryTable from '@/components/song/SongHistoryTable.vue';
import CommentFrame from '@/components/user/CommentFrame.vue';
import SongInfo from '@/components/song/SongInfo.vue';
import SongChart from '@/components/song/SongChart.vue';
import { ElSelect, ElOption } from 'element-plus';
const statusStore = useStatusStore()

const options = [
  { title: '日刊数据', boardId: 'vocaloid-daily', },
  { title: '周刊数据', boardId: 'vocaloid-weekly', },
  { title: '月刊数据', boardId: 'vocaloid-monthly', },
]

const songId = ref<string>();
const chartData = ref<any>()
const chartBoardId = ref<string>('vocaloid-daily')
const chartDataMap: Record<string, any> = {}

function hasKeys<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): boolean {
  return keys.every(k => k in obj);
}

function selectChart(value: string) {
  console.log(chartDataMap)
  if (chartBoardId.value)
    chartData.value = chartDataMap[value]
}

function handleData(props: any) {
  chartDataMap[props.boardId] = props
  if (hasKeys(chartDataMap, ['vocaloid-daily', 'vocaloid-weekly', 'vocaloid-monthly']))
    chartData.value = chartDataMap[chartBoardId.value]
}

onMounted(async () => {
  const route = useRoute(); // 在生命周期钩子中调用 useRoute
  songId.value = route.params.id as string ; // 更新 songId
  statusStore.articleId = songId.value;
})
</script>


<style lang="scss" scoped>
/* 保证页面没有横向滚动条 */
html,
body {
  margin: 0px;
  padding: 0px;
  overflow-x: hidden;
  /* 禁止水平滚动 */
  width: 100%;
  height: 100%;
}

a {
  text-decoration: none;
}

/* 表格优化：禁止表格产生水平滚动 */
.el-table {
  margin: 0;
  padding: 0;
  border: none;
  width: 100%;
  /* 保证表格宽度始终自适应 */
}

.el-table-column {
  padding: 12px;
}

/* 小屏幕适配 */
@media (max-width: 768px) {
  .song-info-container {
    padding: 10px;
    margin-left: 50px;
    margin-right: 50px;
    /* 小屏幕时减少内边距 */
  }

  .board-title {
    font-size: 20px;
    /* 小屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 8px;
    /* 小屏幕时调整表格内边距 */
  }

  .el-table-column {
    padding: 10px;
    /* 小屏幕时调整表格列的内边距 */
  }
}

/* 超小屏幕适配（如手机） */
@media (max-width: 480px) {
  .song-info-container {
    padding: 10px;
    /* 手机屏幕时进一步减小内边距 */
  }

  .board-title {
    font-size: 18px;
    /* 手机屏幕时调整标题字体大小 */
  }

  .board-table {
    padding: 5px;
    /* 手机屏幕时减少表格内边距 */
  }

  .el-table-column {
    padding: 8px;
    /* 手机屏幕时调整表格列的内边距 */
  }
}
</style>
